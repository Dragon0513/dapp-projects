import hre from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";
import { AggregatorV3Interface__factory } from "../typechain/factories/AggregatorV3Interface__factory";

const AGGREGATOR = process.env.AGGREGATOR as string;

const main = async () => {
  console.log(`Fetching latest BTC price in USD... 🤑`);

  const signers = await hre.ethers.getSigners();
  const aggregator = AggregatorV3Interface__factory.connect(
    AGGREGATOR,
    signers[0]
  );

  console.log(`\nLatest BTC Price Feed:`);
  const latestPrice = await aggregator.functions.latestRoundData();
  console.log(`\tRound ID: ${latestPrice.roundId}`);
  console.log(`\tLatest Price: $ ${+latestPrice.answer.toString() / 10 ** 8}`);
  console.log(`\tStarted At: ${latestPrice.startedAt}`);
  console.log(`\tTimestamp: ${latestPrice.updatedAt}`);
  console.log(`\tAnswered In Round: ${latestPrice.answeredInRound}`);

  console.log(`\nHistorical BTC Price Feed:`);
  const validRoundId = BigNumber.from("36893488147419115558");
  const historicalPrice = await aggregator.functions.getRoundData(validRoundId);
  console.log(`\tRound ID: ${historicalPrice.roundId}`);
  console.log(
    `\tLatest Price: $ ${+historicalPrice.answer.toString() / 10 ** 8}`
  );
  console.log(`\tStarted At: ${historicalPrice.startedAt}`);
  console.log(`\tTimestamp: ${historicalPrice.updatedAt}`);
  console.log(`\tAnswered In Round: ${historicalPrice.answeredInRound}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
