const FakeDai = artifacts.require("FakeDai");
const SharesToken = artifacts.require("SharesToken");
const MySplitter = artifacts.require("MySplitter");
const accounts = require("./ganacheAccounts.json");

module.exports = async callback => {
  const fakeDai = await FakeDai.deployed();
  const sharesToken = await SharesToken.deployed();
  const mySplitter = await MySplitter.deployed();

  const shareHolders = accounts.slice(0, 5);
  const daiSender = accounts[5];

  const amount = "1000" + "000000000000000000";

  let allowance = await fakeDai.allowance(daiSender, mySplitter.address);
  let balance = await fakeDai.balanceOf(mySplitter.address);
  console.log(
    "MySplitter's allowance before allowing:",
    allowance.toString() / 1e18,
    "FDAI"
  );
  console.log(
    "MySplitter's balance before allowing:",
    balance.toString() / 1e18,
    "FDAI"
  );
  console.log("");

  console.log("Allowing", amount / 1e18, "fake DAIs to payment splitter...");
  await fakeDai.approve(mySplitter.address, amount, {
    from: daiSender,
  });
  console.log("");

  allowance = await fakeDai.allowance(daiSender, mySplitter.address);
  balance = await fakeDai.balanceOf(mySplitter.address);
  console.log(
    "MySplitter's allowance after allowing:",
    allowance.toString() / 1e18,
    "FDAI"
  );
  console.log(
    "MySplitter's balance after allowing:",
    balance.toString() / 1e18,
    "FDAI"
  );
  console.log("");

  console.log("MySplitter receiving", amount / 1e18, "fake DAIs...");
  await mySplitter.receivePayment(daiSender, amount);
  console.log("");

  allowance = await fakeDai.allowance(daiSender, mySplitter.address);
  balance = await fakeDai.balanceOf(mySplitter.address);
  console.log(
    "MySplitter's allowance after receiving:",
    allowance.toString() / 1e18,
    "FDAI"
  );
  console.log(
    "MySplitter's balance after receiving:",
    balance.toString() / 1e18,
    "FDAI"
  );

  callback();
};
