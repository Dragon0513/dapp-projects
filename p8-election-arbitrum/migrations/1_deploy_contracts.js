const Election = artifacts.require("Election");

module.exports = async function (deployer, _, accounts) {
  // console.log({ accounts });

  await deployer.deploy(Election);
};
