// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Election {
  // Model a Candidate
  struct Candidate {
    uint256 id;
    string name;
    uint256 voteCount;
  }

  // Store accounts that have voted
  mapping(address => bool) public voters;
  // Store Candidates
  // Fetch Candidate
  mapping(uint256 => Candidate) public candidates;
  // Store Candidates Count
  uint256 public candidatesCount;

  // Voted event
  event Voted(uint256 indexed _candidateId, address indexed by);

  constructor() {
    addCandidate("Danish");
    addCandidate("Ehsan");
  }

  function addCandidate(string memory _name) private {
    candidates[candidatesCount] = Candidate({
      id: candidatesCount,
      name: _name,
      voteCount: 0
    });
    ++candidatesCount;
  }

  function vote(uint256 _candidateId) public {
    require(!voters[msg.sender], "Election: already voted");
    require(_candidateId < candidatesCount, "Election: invalid candidate id");

    voters[msg.sender] = true;
    candidates[_candidateId].voteCount++;
    emit Voted(_candidateId, msg.sender);
  }
}