import hre from "hardhat";

const main = async () => {
  console.log(`Deploying DataFeedConsumer to ${hre.network.name} Network`);

  const signers = await hre.ethers.getSigners();

  const DataFeedConsumer = (
    await hre.ethers.getContractFactory("DataFeedConsumer")
  ).connect(signers[0]);
  const dataFeedConsumer = await DataFeedConsumer.deploy();
  await dataFeedConsumer.deployed();
  console.log(`Deployed MyRNG contract at ${dataFeedConsumer.address}`);
  console.log(`Deployer Address: ${dataFeedConsumer.deployTransaction.from}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
