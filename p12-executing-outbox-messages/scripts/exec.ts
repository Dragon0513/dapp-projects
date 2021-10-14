import { providers, Wallet } from "ethers";
import { Bridge, OutgoingMessageState } from "arb-ts";

const RINKEBY_RPC = process.env.RINKEBY_RPC as string;
const ARBITRUM_TESTNET_RPC = process.env.ARBITRUM_TESTNET_RPC as string;
const WALLET_PRIVATE_KEY = process.env.DEVNET_PRIVKEY as string;

const wait = (ms = 0) => {
  return new Promise(res => setTimeout(res, ms || 10000));
};

/**
 * Instantiate wallets and providers for bridge
 */
const l1Provider = new providers.JsonRpcProvider(RINKEBY_RPC);
const l2Provider = new providers.JsonRpcProvider(ARBITRUM_TESTNET_RPC);
const l1Wallet = new Wallet(WALLET_PRIVATE_KEY, l1Provider);
const l2Wallet = new Wallet(WALLET_PRIVATE_KEY, l2Provider);

const main = async () => {
  console.log("Outbox Execution");
  const txnHash =
    "0xba53225eb9ed117a5b70bea31e22b43103a79e9abcfbcd10f8426f7a227f75ef";

  /**
   * We start with a txn hash; we assume this is transaction that triggered an
   * L2 to L1 Message on L2 (i.e., ArbSys.sendTxToL1).
   */
  if (!txnHash) {
    throw new Error(
      "Provide a transaction hash of an L2 transaction that sends an L2 to L1 message"
    );
  }
  if (!txnHash.startsWith("0x") || txnHash.trim().length != 66)
    throw new Error(`Hmm, ${txnHash} doesn't look like a txn hash...`);

  /**
   * Use wallets to create an arb-ts bridge instance
   * We'll use bridge for its convenience methods around outbox-execution
   */
  const bridge = await Bridge.init(l1Wallet, l2Wallet);

  /**
   * First, let's find the Arbitrum txn from the txn hash provided
   */
  const initiatingTxnReceipt = await bridge.l2Provider.getTransactionReceipt(
    txnHash
  );

  if (!initiatingTxnReceipt)
    throw new Error(
      `No Arbitrum transaction found with provided txn hash: ${txnHash}`
    );

  /**
   * In order to trigger the outbox message, we'll first need the outgoing
   * message's batch number and index; together these two things uniquely
   * identify an outgoing message.
   * To get this data, we'll use getWithdrawalsInL2Transaction, which retrieves
   * this data from the L2 events logs
   */

  const outGoingMessagesFromTxn =
    bridge.getWithdrawalsInL2Transaction(initiatingTxnReceipt);

  if (outGoingMessagesFromTxn.length === 0) {
    throw new Error(`Txn ${txnHash} did not initiate an outgoing messages`);
  }

  /**
   * Note that in principle, a single transaction could trigger any number of
   * outgoing messages; the common case will be there's only one.
   * For the sake of this script, we assume there's only one / just grab the
   * first one.
   */
  const { batchNumber, indexInBatch } = outGoingMessagesFromTxn[0];

  /**
   * We've got batchNumber and indexInBatch in hand; but before we try to
   * execute our message, we need to make sure it's confirmed! (It can only be
   * confirmed after the dispute period; Arbitrum is an optimistic rollup
   * after-all).
   * Here, we'll do a period check; once getOutGoingMessageState tells us our
   * txn is confirmed, we'll move on to execution.
   */
  const outgoingMessageState = await bridge.getOutGoingMessageState(
    batchNumber,
    indexInBatch
  );
  console.log(
    `Waiting for message to be confirmed: Batchnumber: ${batchNumber}, IndexInBatch ${indexInBatch}`
  );
  console.log(
    `Current status of message: ${OutgoingMessageState[outgoingMessageState]}`
  );

  while (!(outgoingMessageState === OutgoingMessageState.CONFIRMED)) {
    console.log("Waiting a minute...");
    await wait(1000 * 60);
    const outgoingMessageState = await bridge.getOutGoingMessageState(
      batchNumber,
      indexInBatch
    );
    console.log(
      `Current status of message: ${OutgoingMessageState[outgoingMessageState]}`
    );

    switch (outgoingMessageState) {
      case OutgoingMessageState.NOT_FOUND: {
        console.log("Message not found; something strange and bad happened");
        process.exit(1);
      }
      case OutgoingMessageState.EXECUTED: {
        console.log(`Message already executed! Nothing else to do here`);
        process.exit(1);
      }
      case OutgoingMessageState.UNCONFIRMED: {
        console.log(
          `Message not yet confirmed; we'll wait a bit and try again`
        );
        break;
      }
      default:
        break;
    }
  }

  console.log("Transaction confirmed! Trying to execute now...");
  /**
   * Now that its confirmed, we can retrieve the Merkle proof data from the
   * chain, and execute our message in its outbox entry.
   * triggerL2ToL1Transaction handles these steps
   */
  const res = await bridge.triggerL2ToL1Transaction(batchNumber, indexInBatch);
  const rec = await res.wait();

  console.log(`Done! Your transaction is executed at ${rec.transactionHash}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
