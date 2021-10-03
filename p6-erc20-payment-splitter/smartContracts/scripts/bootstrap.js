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

  console.log("Sending 1000 Shares to first five accounts...");
  shareHolders.forEach(async shareHolder => {
    await sharesToken.sendMe500Shares({ from: shareHolder });
    await sharesToken.sendMe500Shares({ from: shareHolder });
  });

  const count = 100;
  console.log(`Sending ${count}000 FDAI to account[5]`);
  for (let i = 0; i < count; ++i) {
    await fakeDai.sendMe1000Dai({ from: daiSender });
  }

  callback();
};
