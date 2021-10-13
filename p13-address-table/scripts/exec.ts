import hre from "hardhat";
import { providers, Wallet } from "ethers";
import { ArbAddressTable__factory } from "arb-ts";
// import { ArbitrumVIP__factory } from "../typechain/factories/ArbitrumVIP__factory";

const ARBITRUM_TESTNET_RPC = process.env.ARBITRUM_TESTNET_RPC as string;
const WALLET_PRIVATE_KEY = process.env.DEVNET_PRIVKEY as string;

/**
 * Instantiate wallets and providers for bridge
 */
const l2Provider = new providers.JsonRpcProvider(ARBITRUM_TESTNET_RPC);
const l2Signer = new Wallet(WALLET_PRIVATE_KEY, l2Provider);

const main = async () => {
  console.log("Using the Address Table");

  /**
   * Deploy ArbitrumVIP contract to L2
   */
  console.log("Deploying ArbitrumVIP contract to Arbitrum...");
  const ArbitrumVIP = (
    await hre.ethers.getContractFactory("ArbitrumVIP")
  ).connect(l2Signer);
  const arbitrumVIP = await ArbitrumVIP.deploy();

  await arbitrumVIP.deployed();
  console.log("ArbitrumVIP deployed to:", arbitrumVIP.address);

  // const arbitrumVIP = ArbitrumVIP__factory.connect(
  //   "0xc4c5168f7eE70A72c2bE131561F6A280031Dd340",
  //   l2Signer
  // );
  // console.log(`Connected to ArbitrumVIP at ${arbitrumVIP.address}`);

  /**
   * Connect to the Arbitrum Address table pre-compile contract
   */
  const arbAddressTable = ArbAddressTable__factory.connect(
    "0x0000000000000000000000000000000000000066",
    l2Signer
  );

  /**
   * Let's find out if our address is registered in the table:
   */
  const addressIsRegistered = await arbAddressTable.addressExists(
    l2Signer.address
  );

  if (!addressIsRegistered) {
    /**
     * If it isn't registered yet, let's register it!
     */
    const txnRes = await arbAddressTable.register(l2Signer.address);
    const txnRec = await txnRes.wait();
    console.log(
      `Successfully registered address ${l2Signer.address} to address table in txn ${txnRec.transactionHash}`
    );
  } else {
    console.log(
      `Address ${l2Signer.address} already (previously) registered to table`
    );
  }
  /**
   * Now that we know it's registered, let's go ahead and retrieve its index
   */
  const addressIndex = await arbAddressTable.lookup(l2Signer.address);

  /**
   * From here on out we can use this index instead of our address as a paramter
   * into any contract with affordances to look up address in the address data.
   */
  const txnRes = await arbitrumVIP.addVipPoints(addressIndex);
  const txnRec = await txnRes.wait();

  /**
   * We got VIP points, and we minimized the calldata required, saving us
   * precious gas. Yay rollups!
   */
  console.log(
    `Successfully added VIP points to address using index ${addressIndex.toNumber()}`
  );
  const vipPoints = await arbitrumVIP.getVipPoints(addressIndex);
  console.log(
    `Current VIP points for ${l2Signer.address}: ${vipPoints.toString()}`
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
