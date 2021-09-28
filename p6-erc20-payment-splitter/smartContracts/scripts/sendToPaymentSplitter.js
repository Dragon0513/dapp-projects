const FakeDai = artifacts.require("FakeDai");
const ApiToken = artifacts.require("ApiToken");
const ERC20PaymentSplitter = artifacts.require("ERC20PaymentSplitter");

const accounts = [
  "0x856af68dFE76c3DaC548D626900766C67b2f3eA4",
  "0x7cD39fA359Ee44B0417B5fa7C5f8414a62d28546",
  "0x55C604311d00462DCbf4e2da6810e59eabdB59f3",
  "0x2C2e1D4a2fbA7271511C781931602052F26582B7",
  "0xA090A74bE3b57aE5967b60e846B2D1f280276224",
  "0xfA37fdA49Ce6D82F217f91b486f0099b8D3E4151",
  "0xCB0A9B793A35814d02e49D71eD064685F1aCAD8D",
  "0x8dC9a96F78D5b61C0E6D40008646d3aeD47dacAF",
  "0x1fe746DF4602c9Dde8be8Ee73b888F9b043b1cEc",
  "0xEc206b5719718D7b96B3227D0D89aF76d1003d19",
];

module.exports = async callback => {
  const fakeDai = await FakeDai.deployed();
  const apiToken = await ApiToken.deployed();
  const paymentSplitter = await ERC20PaymentSplitter.deployed();

  const shareHolders = accounts.slice(0, 5);
  const daiSender = accounts[5];

  // const

  callback();
};
