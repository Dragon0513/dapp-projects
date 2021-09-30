// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract FakeDai is Context, ERC20 {
  constructor() ERC20("FakeDai", "FDAI") {}

  function sendMe1000Dai() external {
    _mint(_msgSender(), 1000 * 10 ** decimals());
  }
}