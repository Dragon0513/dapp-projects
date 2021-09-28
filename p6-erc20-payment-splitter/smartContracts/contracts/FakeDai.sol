// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeDai is ERC20 {
  constructor() ERC20("FakeDai", "FDAI") {
    // Mint 1 million MyToken tokens.
    _mint(msg.sender, 1_000_000 * 10 ** decimals());
  }
}