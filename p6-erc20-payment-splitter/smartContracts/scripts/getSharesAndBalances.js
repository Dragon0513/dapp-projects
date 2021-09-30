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

  console.log("Shares:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let shares = await apiToken.getShares(shareHolders[i]);
    console.log(`\tAcc${i}:`, shares.toString() / 1e18, "ATKN");
  }
  const totalShares = await apiToken.getTotalShares();
  console.log("\tTotal Shares:", totalShares.toString() / 1e18, "ATKN");
  console.log("");

  console.log("Released Payments:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let paid = await mySplitter.totalPaidTo(shareHolders[i]);
    console.log(`\tAcc${i}:`, paid.toString() / 1e18, "FDAI");
  }
  console.log("");

  console.log("Pending Payments:");
  for (let i = 0; i < shareHolders.length; ++i) {
    let payments = await mySplitter.paymentPending(shareHolders[i]);
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
  const currentBalance = await fakeDai.balanceOf(mySplitter.address);
  console.log(
    "\tCurrent Fake Dai Balance:",
    currentBalance.toString() / 1e18,
    "FDAI"
  );
  const totalReceived = await mySplitter.totalReceived();
  console.log(
    "\tTotal Fake DAI Received:",
    totalReceived.toString() / 1e18,
    "FDAI"
  );
  const totalPaid = await mySplitter.totalPaid();
  console.log(
    "\tTotal Fake DAI Released:",
    totalPaid.toString() / 1e18,
    "FDAI"
  );

  callback();
};
