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
  let balance = await fakeDai.balanceOf(paymentSplitter.address);
  console.log(
    "PaymentSplitter's allowance before allowing:",
    allowance.toString() / 1e18,
    "FDAI"
  );
  console.log(
    "PaymentSplitter's balance before allowing:",
    balance.toString() / 1e18,
    "FDAI"
  );
  console.log("");

  console.log("Allowing", amount / 1e18, "fake DAIs to payment splitter...");
  await fakeDai.approve(paymentSplitter.address, amount, {
    from: daiSender,
  });
  console.log("");

  allowance = await fakeDai.allowance(daiSender, paymentSplitter.address);
  balance = await fakeDai.balanceOf(paymentSplitter.address);
  console.log(
    "PaymentSplitter's allowance after allowing:",
    allowance.toString() / 1e18,
    "FDAI"
  );
  console.log(
    "PaymentSplitter's balance after allowing:",
    balance.toString() / 1e18,
    "FDAI"
  );
  console.log("");

  console.log("Payment splitter receiving", amount / 1e18, "fake DAIs...");
  await paymentSplitter.receivePayment(daiSender, amount);

  allowance = await fakeDai.allowance(daiSender, paymentSplitter.address);
  balance = await fakeDai.balanceOf(paymentSplitter.address);
  console.log(
    "PaymentSplitter's allowance after receiving:",
    allowance.toString() / 1e18,
    "FDAI"
  );
  console.log(
    "PaymentSplitter's balance after receiving:",
    balance.toString() / 1e18,
    "FDAI"
  );

  callback();
};
