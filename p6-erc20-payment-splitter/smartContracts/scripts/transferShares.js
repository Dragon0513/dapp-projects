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

  const amount = "500" + "000000000000000000";

  console.log("Shares Before:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let shares = await sharesToken.getShares(shareHolders[i]);
    console.log(`\tAcc${i}:`, shares.toString() / 1e18, "SHA");
  }
  console.log("");

  const fromIndex = 0;
  const toIndex = 1;
  console.log(
    `Sending ${amount / 1e18} SHA from Acc${fromIndex} to Acc${toIndex}...`
  );
  await sharesToken.transfer(shareHolders[toIndex], amount, {
    from: shareHolders[fromIndex],
  });
  console.log("");

  console.log("Shares After:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let shares = await sharesToken.getShares(shareHolders[i]);
    console.log(`\tAcc${i}:`, shares.toString() / 1e18, "SHA");
  }

  callback();
};
