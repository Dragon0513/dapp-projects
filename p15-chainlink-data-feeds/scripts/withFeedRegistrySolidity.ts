import hre from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";
import { FeedRegistryConsumer__factory } from "../typechain/factories/FeedRegistryConsumer__factory";

const FEED_REGISTRY_CONSUMER = process.env.DATA_FEED_CONSUMER as string;

const main = async () => {
  console.log(`Fetching latest ETH price in USD... 🤑`);

  const signers = await hre.ethers.getSigners();
  const feedRegistryConsumer = FeedRegistryConsumer__factory.connect(
    FEED_REGISTRY_CONSUMER,
    signers[0]
  );

  // ******************** Latest Price ********************

  console.log(`\nLatest ETH Price Feed:`);
  const latestPrice =
    await feedRegistryConsumer.functions.getLatestEthUsdPrice();
  console.log(`\tRound ID: ${latestPrice.roundId}`);
  console.log(`\tLatest Price: $ ${+latestPrice.price.toString() / 10 ** 8}`);
  let timestamp = new Date(+latestPrice.startedAt.toString() * 1000);
  console.log(`\tStarted At: ${timestamp.toString()}`);
  timestamp = new Date(+latestPrice.timestamp.toString() * 1000);
  console.log(`\tTimestamp: ${timestamp.toString()}`);
  console.log(`\tAnswered In Round: ${latestPrice.answeredInRound}`);

  // ******************** Historical Price ********************

  console.log(`\nHistorical ETH Price Feed:`);
  const validRoundId = BigNumber.from("36893488147419115558");
  const historicalPrice =
    await feedRegistryConsumer.functions.getHistoricalEthUsdPrice(validRoundId);
  console.log(`\tRound ID: ${historicalPrice.roundId}`);
  console.log(
    `\tLatest Price: $ ${+historicalPrice.price.toString() / 10 ** 8}`
  );
  timestamp = new Date(+historicalPrice.startedAt.toString() * 1000);
  console.log(`\tStarted At: ${timestamp.toString()}`);
  timestamp = new Date(+historicalPrice.timestamp.toString() * 1000);
  console.log(`\tTimestamp: ${timestamp.toString()}`);
  console.log(`\tAnswered In Round: ${historicalPrice.answeredInRound}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
