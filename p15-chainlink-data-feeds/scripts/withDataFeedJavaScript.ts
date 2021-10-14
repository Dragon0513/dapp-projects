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
  let timestamp = new Date(+latestPrice.startedAt.toString() * 1000);
  console.log(`\tStarted At: ${timestamp.toString()}`);
  timestamp = new Date(+latestPrice.updatedAt.toString() * 1000);
  console.log(`\tTimestamp: ${timestamp.toString()}`);
  console.log(`\tAnswered In Round: ${latestPrice.answeredInRound}`);

  console.log(`\nHistorical BTC Price Feed:`);
  const validRoundId = BigNumber.from("36893488147419115558");
  const historicalPrice = await aggregator.functions.getRoundData(validRoundId);
  console.log(`\tRound ID: ${historicalPrice.roundId}`);
  console.log(
    `\tLatest Price: $ ${+historicalPrice.answer.toString() / 10 ** 8}`
  );
  timestamp = new Date(+historicalPrice.startedAt.toString() * 1000);
  console.log(`\tStarted At: ${timestamp.toString()}`);
  timestamp = new Date(+historicalPrice.updatedAt.toString() * 1000);
  console.log(`\tTimestamp: ${timestamp.toString()}`);
  console.log(`\tAnswered In Round: ${historicalPrice.answeredInRound}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
