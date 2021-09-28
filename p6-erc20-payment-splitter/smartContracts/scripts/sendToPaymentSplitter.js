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

  const amount = "1000" + "000000000000000000";

  let allowance = await fakeDai.allowance(daiSender, paymentSplitter.address);
  console.log(
    "PaymentSplitter's allowance before:",
    allowance.toString() / 1e18,
    "FDAI"
  );

  await fakeDai.approve(paymentSplitter.address, amount, {
    from: daiSender,
  });

  allowance = await fakeDai.allowance(daiSender, paymentSplitter.address);
  console.log(
    "PaymentSplitter's allowance after:",
    allowance.toString() / 1e18,
    "FDAI"
  );

  console.log("Sending", amount / 1e18, "fake DAIs to payment splitter...");
  await paymentSplitter.receivePayment(daiSender, amount);

  callback();
};
