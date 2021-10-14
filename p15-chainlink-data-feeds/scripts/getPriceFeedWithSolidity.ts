import hre from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";
import { DataFeedConsumer__factory } from "../typechain/factories/DataFeedConsumer__factory";

const DATA_FEED_CONSUMER = process.env.DATA_FEED_CONSUMER as string;

const main = async () => {
  console.log(`Fetching latest BTC price in USD... 🤑`);

  const signers = await hre.ethers.getSigners();
  const dataFeedConsumer = DataFeedConsumer__factory.connect(
    DATA_FEED_CONSUMER,
    signers[0]
  );

  console.log(`\nLatest BTC Price Feed:`);
  const latestPrice = await dataFeedConsumer.functions.getLatestPrice();
  console.log(`\tRound ID: ${latestPrice.roundID}`);
  console.log(`\tLatest Price: $ ${+latestPrice.price.toString() / 10 ** 8}`);
  console.log(`\tStarted At: ${latestPrice.startedAt}`);
  console.log(`\tTimestamp: ${latestPrice.timestamp}`);
  console.log(`\tAnswered In Round: ${latestPrice.answeredInRound}`);

  console.log(`\nHistorical BTC Price Feed:`);
  const validRoundId = BigNumber.from("36893488147419115558");
  const historicalPrice = await dataFeedConsumer.functions.getHistoricalPrice(
    validRoundId
  );
  console.log(`\tRound ID: ${historicalPrice.roundID}`);
  console.log(
    `\tLatest Price: $ ${+historicalPrice.price.toString() / 10 ** 8}`
  );
  console.log(`\tStarted At: ${historicalPrice.startedAt}`);
  console.log(`\tTimestamp: ${historicalPrice.timestamp}`);
  console.log(`\tAnswered In Round: ${historicalPrice.answeredInRound}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
