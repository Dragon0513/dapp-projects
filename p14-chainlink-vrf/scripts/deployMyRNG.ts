import hre from "hardhat";

const main = async () => {
  console.log(`Deploying MyRNG Contract to ${hre.network.name} Network`);

  const signers = await hre.ethers.getSigners();

  const MyRNG = (await hre.ethers.getContractFactory("MyRNG")).connect(
    signers[0]
  );
  const myRNG = await MyRNG.deploy();
  await myRNG.deployed();
  console.log(`Deployed MyRNG contract at ${myRNG.address}`);
  console.log(`Deployer Address: ${myRNG.deployTransaction.from}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
