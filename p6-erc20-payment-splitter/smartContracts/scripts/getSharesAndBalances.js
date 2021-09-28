const FakeDai = artifacts.require("FakeDai");
const ApiToken = artifacts.require("ApiToken");
const ERC20PaymentSplitter = artifacts.require("ERC20PaymentSplitter");
const accounts = require("./ganacheAccounts.json");

module.exports = async callback => {
  const fakeDai = await FakeDai.deployed();
  const apiToken = await ApiToken.deployed();
  const paymentSplitter = await ERC20PaymentSplitter.deployed();

  const shareHolders = accounts.slice(0, 5);
  const daiSender = accounts[5];

  console.log("Shares:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let shares = await apiToken.currentShares(shareHolders[i]);
    console.log(`\tAcc${i}:`, shares.toString() / 1e18, "ATKN");
  }
  const totalShares = await paymentSplitter.totalShares();
  console.log("\tTotal Shares:", totalShares.toString() / 1e18, "ATKN");
  console.log("");

  console.log("Released Payments:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let payments = await paymentSplitter.totalReleasedTo(shareHolders[i]);
    console.log(`\tAcc${i}:`, payments.toString() / 1e18, "FDAI");
  }
  console.log("");

  console.log("Pending Payments:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let payments = await paymentSplitter.paymentPending(shareHolders[i]);
    console.log(`\tAcc${i}:`, payments.toString() / 1e18, "FDAI");
  }
  console.log("");

  console.log("Fake DAI Balance:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let balance = await fakeDai.balanceOf(shareHolders[i]);
    console.log(`\tAcc${i}:`, balance.toString() / 1e18, "FDAI");
  }
  console.log("");

  console.log("Payment Splitter:");
  const currentBalance = await fakeDai.balanceOf(paymentSplitter.address);
  console.log(
    "\tCurrent Fake Dai Balance:",
    currentBalance.toString() / 1e18,
    "FDAI"
  );
  const totalReceived = await paymentSplitter.totalReceived();
  console.log(
    "\tTotal Fake DAI Received:",
    totalReceived.toString() / 1e18,
    "FDAI"
  );
  const totalReleased = await paymentSplitter.totalReleased();
  console.log(
    "\tTotal Fake DAI Released:",
    totalReleased.toString() / 1e18,
    "FDAI"
  );

  callback();
};
