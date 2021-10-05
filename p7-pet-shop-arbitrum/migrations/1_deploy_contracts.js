const Adoption = artifacts.require("Adoption");

module.exports = async function (deployer, _, accounts) {
  console.log({ accounts });

  await deployer.deploy(Adoption);
};
