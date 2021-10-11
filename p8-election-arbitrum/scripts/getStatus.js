const Election = artifacts.require("Election");

module.exports = async callback => {
  const election = await Election.deployed();
  const accounts = await web3.eth.getAccounts();

  console.log("***** Election Status *****");
  console.log("Id\tName\tVotes");
  let numCandidates = await election.candidatesCount();
  for (let i = 0; i < numCandidates; ++i) {
    const candidate = await election.candidates(i);
    console.log(
      `${candidate.id.toString()}\t${
        candidate.name
      }\t${candidate.voteCount.toString()}`
    );
  }

  callback();
};
