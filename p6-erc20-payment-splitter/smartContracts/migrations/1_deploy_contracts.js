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

  // Grant SNAPSHOT_CREATOR role to MySplitter.
  const mySplitter = await MySplitter.deployed();
  const snapshotCreatorRole = await sharesToken.SNAPSHOT_CREATOR();
  await sharesToken.grantRole(snapshotCreatorRole, mySplitter.address);

  // Revoke ERC20_SHARES_ADMIN_ROLE role from contract deployer.
  const erc20SharesAdminRole = await sharesToken.ERC20_SHARES_ADMIN_ROLE();
  await sharesToken.renounceRole(erc20SharesAdminRole, accounts[0]);
};
