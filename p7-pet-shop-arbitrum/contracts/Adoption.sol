// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Adoption {
  address[8] public adopters = [
    address(0),
    address(0),
    address(0),
    address(0),
    address(0),
    address(0),
    address(0),
    address(0)
  ];

  function adopt(uint petId) public returns (uint) {
    require(petId < adopters.length, "Adoption: Invalid pet id");
    adopters[petId] = msg.sender;
    return petId;
  }

  function getAdopters() public view returns (address[8] memory) {
    return adopters;
  }
}
