const FakeDai = artifacts.require("FakeDai");
const ApiToken = artifacts.require("ApiToken");
const ERC20PaymentSplitter = artifacts.require("ERC20PaymentSplitter");
const accounts = require("./ganacheAccounts.json");

module.exports = async (callback, acc) => {
  const fakeDai = await FakeDai.deployed();
  const apiToken = await ApiToken.deployed();
  const paymentSplitter = await ERC20PaymentSplitter.deployed();

  const shareHolders = accounts.slice(0, 5);
  const daiSender = accounts[5];

  const payeeIndex = 1;
  console.log(`Releasing payment to Acc${payeeIndex}...`);
  await paymentSplitter.release({ from: shareHolders[payeeIndex] });

  callback();
};
