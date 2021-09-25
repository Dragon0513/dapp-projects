const MyContract = artifacts.require("MyContract");
const MyVoteToken = artifacts.require("MyVoteToken");
const MyTimelockController = artifacts.require("MyTimelockController");
const MyGovernor = artifacts.require("MyGovernor");

module.exports = function (deployer, _, accounts) {
  console.log({ accounts });

  // deployer.deploy(MyContract);

  // deployer.deploy(MyVoteToken, accounts.slice(0, 5));

  // deployer.deploy(
  //   MyTimelockController,
  //   60,
  //   accounts.slice(0, 3),
  //   accounts.slice(2, 5)
  // );

  // deployer.link(MyVoteToken, MyGovernor);
  // deployer.link(MyTimelockController, MyGovernor);
  deployer.deploy(
    MyGovernor,
    "0x208D93929123c320Eb19FB7810e5bC0cc4A79C5d",
    "0xFE33f682f8B04342Ed0993c7D9E52BF751fCaa0E"
  );
};
