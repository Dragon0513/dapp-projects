// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ArbAddressTable.sol";

contract ArbitrumVIP {
  string greeting;
  // Maps address to vip points. More points you have, cooler you are.
  mapping(address => uint256) arbitrumVipPoints;

  ArbAddressTable arbAddressTable;

  constructor() {
    // Connect to precomiled address table contract
    arbAddressTable = ArbAddressTable(address(102));
  }

  function getVipPoints(uint256 addressIndex) public view returns (uint256) {
    address addressFromTable = arbAddressTable.lookupIndex(addressIndex);
    return arbitrumVipPoints[addressFromTable];
  }

  function addVipPoints(uint addressIndex) external {
    // Retreive address from address table
    address addressFromTable = arbAddressTable.lookupIndex(addressIndex);

    arbitrumVipPoints[addressFromTable]++;
  }

  function addressesCount() public view returns (uint256) {
    return arbAddressTable.size();
  }
}
