const Election = artifacts.require("Election");

module.exports = async callback => {
  const election = await Election.deployed();
  const accounts = await web3.eth.getAccounts();

  const idToVote = 1;
  const voter = accounts[1];

  console.log("Voting candidate", idToVote);
  const numCandidates = await election.candidatesCount();
  const hasVoted = await election.voters(voter);

  if (idToVote < 0 || idToVote >= numCandidates) {
    console.error("Invalid id!");
    console.error("Failed");
  } else if (hasVoted) {
    console.error("You have already voted!");
    console.error("Failed");
  } else {
    await election.vote(idToVote, { from: voter });
    console.log("Success");
  }

  callback();
};
