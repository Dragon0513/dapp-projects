const FakeDai = artifacts.require("FakeDai");
const SharesToken = artifacts.require("SharesToken");
const MySplitter = artifacts.require("MySplitter");

module.exports = async function (deployer, _, accounts) {
  // console.log({ accounts });

  await deployer.deploy(FakeDai);
  await deployer.deploy(SharesToken);

  const fakeDai = await FakeDai.deployed();
  const sharesToken = await SharesToken.deployed();
  await deployer.deploy(MySplitter, sharesToken.address, fakeDai.address);
};
