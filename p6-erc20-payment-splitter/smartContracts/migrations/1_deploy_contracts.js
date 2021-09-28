const FakeDai = artifacts.require("FakeDai");
const ApiToken = artifacts.require("ApiToken");
const ERC20PaymentSplitter = artifacts.require("ERC20PaymentSplitter");

module.exports = async function (deployer, _, accounts) {
  console.log({ accounts });

  await deployer.deploy(FakeDai, { from: accounts[5] });
  await deployer.deploy(ApiToken, "ApiToken", "ATKN", accounts.slice(0, 5));

  const apiToken = await FakeDai.deployed();
  const fakeDai = await FakeDai.deployed();
  await deployer.deploy(
    ERC20PaymentSplitter,
    apiToken.address,
    fakeDai.address
  );
};
