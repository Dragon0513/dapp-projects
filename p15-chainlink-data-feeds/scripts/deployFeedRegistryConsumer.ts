import hre from "hardhat";

const main = async () => {
  console.log(`Deploying FeedRegistryConsumer to ${hre.network.name} Network`);

  const signers = await hre.ethers.getSigners();

  const FeedRegistryConsumer = (
    await hre.ethers.getContractFactory("FeedRegistryConsumer")
  ).connect(signers[0]);
  const feedRegistryConsumer = await FeedRegistryConsumer.deploy();
  await feedRegistryConsumer.deployed();
  console.log(
    `Deployed FeedRegistryConsumer contract at ${feedRegistryConsumer.address}`
  );
  console.log(
    `Deployer Address: ${feedRegistryConsumer.deployTransaction.from}`
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
