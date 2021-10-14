import hre from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";
import { FeedRegistryInterface__factory } from "../typechain/factories/FeedRegistryInterface__factory";

const FEED_REGISTRY = process.env.FEED_REGISTRY as string;

const main = async () => {
  console.log(`Fetching latest ETH price in USD... 🤑`);

  const signers = await hre.ethers.getSigners();
  const feedRegistry = FeedRegistryInterface__factory.connect(
    FEED_REGISTRY,
    signers[0]
  );

  const base = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const quote = "0x0000000000000000000000000000000000000348";

  // ******************** Latest Price ********************

  console.log(`\nLatest ETH Price Feed:`);
  const latestPrice = await feedRegistry.functions.latestRoundData(base, quote);
  console.log(`\tRound ID: ${latestPrice.roundId}`);
  console.log(`\tLatest Price: $ ${+latestPrice.answer.toString() / 10 ** 8}`);
  let timestamp = new Date(+latestPrice.startedAt.toString() * 1000);
  console.log(`\tStarted At: ${timestamp.toString()}`);
  timestamp = new Date(+latestPrice.updatedAt.toString() * 1000);
  console.log(`\tTimestamp: ${timestamp.toString()}`);
  console.log(`\tAnswered In Round: ${latestPrice.answeredInRound}`);

  // ******************** Historical Price ********************

  console.log(`\nHistorical ETH Price Feed:`);
  const roundId = BigNumber.from("18446744073709561155");
  const historicalPrice = await feedRegistry.functions.getRoundData(
    base,
    quote,
    roundId
  );
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
