const SharjeelToken = artifacts.require("SharjeelToken");

module.exports = function (deployer, network, accounts) {
  // console.log(accounts);
  console.log(`Deploying to ${network} Network:`);
  deployer.deploy(SharjeelToken, { from: accounts[0] });
};
