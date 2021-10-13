import hre from "hardhat";
import { MyRNG__factory } from "../typechain/factories/MyRNG__factory";

const MY_RNG = process.env.MY_RNG as string;

const main = async () => {
  console.log(`Fetching current number... 👋`);

  const signers = await hre.ethers.getSigners();
  const myRng = MyRNG__factory.connect(MY_RNG, signers[0]);

  const currentNumber = await myRng.functions.randomResult();
  console.log(`Current Random Number State: ${currentNumber.toString()}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
