const MyDex = artifacts.require("MyDex");
const MY_TOKEN_ADDRESS = process.env.MY_TOKEN_ADDRESS as string;

module.exports = function(deployer, network, accounts) {
  console.log(`Network: ${network}`);
  deployer.deploy(MyDex, MY_TOKEN_ADDRESS, { from: accounts[0] });
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
