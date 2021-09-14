const MyERC20Token = artifacts.require("MyERC20Token");

module.exports = function (deployer, network, accounts) {
  // console.log(accounts);
  console.log(`Deploying to ${network} Network:`);
  deployer.deploy(MyERC20Token, { from: accounts[0] });
};
