import { utils, providers, Wallet } from "ethers";
import { BridgeHelper } from "arb-ts";
import { ethers } from "hardhat";
const { parseEther } = utils;

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
 * Set the amount to be withdrawn from L2 (in wei)
 */
const ethFromL2WithdrawAmount = parseEther("0.001");

const main = async () => {
  console.log("Withdraw Eth through DApp");

  /**
   * First, let's check our L2 wallet's initial ETH balance and ensure there's some ETH to withdraw
   */
  const l2WalletInitialEthBalance = await l2Provider.getBalance(
    l2Wallet.address
  );

  if (l2WalletInitialEthBalance.lt(ethFromL2WithdrawAmount)) {
    console.log(
      `Oops - not enough ether; fund your account L2 wallet currently ${l2Wallet.address} with at least 0.001 ether`
    );
    process.exit(1);
  }
  console.log("Wallet properly funded: initiating withdrawal now");

  /**
   * We'll deploy a contract which we'll use to trigger an Ether withdrawal
   */

  const L2Withdraw = await (
    await ethers.getContractFactory("Withdraw")
  ).connect(l2Wallet);
  const l2Withdraw = await L2Withdraw.deploy();
  console.log("Deploying Withdraw contract to L2");
  await l2Withdraw.deployed();
  console.log(`Withdraw contract deployed to: ${l2Withdraw.address}`);

  /**
   * Now we can call our contracts withdrawEth method, which in turn will initiate a withdrawal:
   */
  const withdrawTx = await l2Withdraw.withdrawEth(l1Wallet.address, {
    value: ethFromL2WithdrawAmount,
  });
  const withdrawRec = await withdrawTx.wait();

  /**
   * And with that, our withdrawal is initiated! No additional time-sensitive actions are required.
   * Any time after the transaction's assertion is confirmed, funds can be transferred out of the bridge via the outbox contract
   * We'll display the withdrawals event data here:
   */
  const withdrawEventData = (
    await BridgeHelper.getWithdrawalsInL2Transaction(withdrawRec, l2Provider)
  )[0];

  console.log(`Ether withdrawal initiated! 🥳 ${withdrawRec.transactionHash}`);
  console.log("Withdrawal data:", withdrawEventData);

  console.log(
    `To to claim funds (after dispute period), see outbox-execute repo ✌️`
  );

  /**
   * Our L2 balance should now be updated!
   */
  const l2WalletUpdatedEthBalance = await l2Provider.getBalance(
    l2Wallet.address
  );

  console.log(
    `Your L2 balance is updated from ${l2WalletInitialEthBalance.toString()} to ${l2WalletUpdatedEthBalance.toString()}`
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
