const FakeDai = artifacts.require("FakeDai");
const ApiToken = artifacts.require("ApiToken");
const MySplitter = artifacts.require("MySplitter");
const accounts = require("./ganacheAccounts.json");

module.exports = async callback => {
  const fakeDai = await FakeDai.deployed();
  const apiToken = await ApiToken.deployed();
  const mySplitter = await MySplitter.deployed();

  const shareHolders = accounts.slice(0, 5);
  const daiSender = accounts[5];

  const payeeIndex = 0;
  let balance = await fakeDai.balanceOf(shareHolders[payeeIndex]);
  console.log(
    `Acc${payeeIndex}`,
    "balance before:",
    balance.toString() / 1e18,
    "FDAI"
  );

  console.log(`Releasing payment to Acc${payeeIndex}...`);
  await mySplitter.releasePayment({ from: shareHolders[payeeIndex] });

  balance = await fakeDai.balanceOf(shareHolders[payeeIndex]);
  console.log(
    `Acc${payeeIndex}`,
    "balance after:",
    balance.toString() / 1e18,
    "FDAI"
  );

  callback();
};
