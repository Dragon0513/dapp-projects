const MyNFT = artifacts.require("MyNFT");

module.exports = function (deployer, network, accounts) {
  // console.log(accounts);
  console.log(`Deploying to ${network} Network:`);
  deployer.deploy(MyNFT, { from: accounts[0] });
};
