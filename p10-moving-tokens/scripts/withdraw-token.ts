import { BigNumber, providers, Wallet } from "ethers";
import { ethers } from "hardhat";
import { Bridge } from "arb-ts";

const RINKEBY_RPC = process.env.RINKEBY_RPC as string;
const ARBITRUM_TESTNET_RPC = process.env.ARBITRUM_TESTNET_RPC as string;
const DEVNET_PRIVKEY = process.env.DEVNET_PRIVKEY as string;

/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */
const l1Provider = new providers.JsonRpcProvider(RINKEBY_RPC);
const l2Provider = new providers.JsonRpcProvider(ARBITRUM_TESTNET_RPC);
const l1Wallet = new Wallet(DEVNET_PRIVKEY, l1Provider);
const l2Wallet = new Wallet(DEVNET_PRIVKEY, l2Provider);

/**
 * Set the amount of token to be deposited and then withdrawn
 */
const tokenWithdrawAmount = BigNumber.from(20000);

const main = async () => {
  console.log("Withdraw token");
  /**
   * Use wallets to create an arb-ts bridge instance
   */
  const bridge = await Bridge.init(l1Wallet, l2Wallet);

  const erc20Address = "0xcC901e58BFEf30c3634C00409B073213168b6942";
  console.log("Dapp Token deployed at", erc20Address);
  console.log(
    "Withdrawing",
    +tokenWithdrawAmount.toString() / 100,
    "Dapp Tokens..."
  );

  /**
   * ... Okay, Now we begin withdrawing DappToken from L2. To withdraw, we'll use the arb-ts helper method withdrawERC20
   * withdrawERC20 will call our L2 Gateway Router to initiate a withdrawal via the Standard ERC20 gateway
   * This transaction is constructed and paid for like any other L2 transaction (it just happens to (ultimately) make a call to ArbSys.sendTxToL1)
   */
  const withdrawTx = await bridge.withdrawERC20(
    erc20Address,
    tokenWithdrawAmount
  );
  const withdrawRec = await withdrawTx.wait();

  /**
   * And with that, our withdrawal is initiated! No additional time-sensitive actions are required.
   * Any time after the transaction's assertion is confirmed, funds can be transferred out of the bridge via the outbox contract
   * We'll display the withdrawals event data here:
   */
  const withdrawEventData =
    bridge.getWithdrawalsInL2Transaction(withdrawRec)[0];

  console.log(`Token withdrawal initiated! 🥳 ${withdrawRec.transactionHash}`);
  console.log("Withdrawal data:", withdrawEventData);

  console.log(
    `To to claim funds (after dispute period), see outbox-execute repo ✌️`
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
