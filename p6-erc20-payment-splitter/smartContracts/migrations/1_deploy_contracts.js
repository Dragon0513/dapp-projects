const FakeDai = artifacts.require("FakeDai");
const ApiToken = artifacts.require("ApiToken");
const MySplitter = artifacts.require("MySplitter");

module.exports = async function (deployer, _, accounts) {
  console.log({ accounts });

  await deployer.deploy(FakeDai, { from: accounts[5] });
  await deployer.deploy(ApiToken, "ApiToken", "ATKN", accounts.slice(0, 5));

  const fakeDai = await FakeDai.deployed();
  const apiToken = await ApiToken.deployed();
  await deployer.deploy(MySplitter, apiToken.address, fakeDai.address);
};
