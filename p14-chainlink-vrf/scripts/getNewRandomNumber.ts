import hre from "hardhat";
import { MyRNG__factory } from "../typechain/factories/MyRNG__factory";

const MY_RNG = process.env.MY_RNG as string;

const main = async () => {
  console.log(`Requesting randomness... 👋`);

  const signers = await hre.ethers.getSigners();
  const myRng = MyRNG__factory.connect(MY_RNG, signers[0]);

  const txnRes = await myRng.functions.getRandomNumber();
  const txnRec = await txnRes.wait();
  console.log(`Txn confirmed at ${txnRec.transactionHash}`);

  const requestEvent =
    txnRec.events &&
    txnRec.events.filter(event => event.event === "RequestMade")[0];
  const requestId = requestEvent && requestEvent.args && requestEvent.args[0];
  console.log(`Request ID: ${requestId ? requestId : "N/A"}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
