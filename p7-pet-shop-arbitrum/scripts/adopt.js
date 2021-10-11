const Adoption = artifacts.require("Adoption");

module.exports = async callback => {
  const adoption = await Adoption.deployed();
  const accounts = await web3.eth.getAccounts();

  console.log("All Adopters Before:");
  let adopters = await adoption.getAdopters();
  adopters.forEach((adopter, ind) => console.log(`\t${ind}. ${adopter}`));
  console.log("");

  const petToAdopt = 3;
  const account = accounts[1];
  console.log("Adopting pet at index", petToAdopt);
  const res = await adoption.adopt(petToAdopt, { from: account });
  console.log(
    "Tx Hash:",
    `https://rinkeby-explorer.arbitrum.io/tx/${res.receipt.transactionHash}`
  );
  console.log("");

  console.log("All Adopters After:");
  adopters = await adoption.getAdopters();
  adopters.forEach((adopter, ind) => console.log(`\t${ind}. ${adopter}`));

  callback();
};
