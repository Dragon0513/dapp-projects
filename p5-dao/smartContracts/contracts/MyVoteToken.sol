// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract MyVoteToken is ERC20, ERC20Permit, ERC20Votes {
  constructor(address[] memory holders)
    ERC20("MyVoteToken", "MVTKN") 
    ERC20Permit("MyVoteToken") 
  {
    for (uint8 i = 0; i < holders.length; ++i) {
      ERC20Votes._mint(holders[i], 1000e18);
    }
  }

  function _afterTokenTransfer(address from, address to, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
  {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address to, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
  {
    super._mint(to, amount);
  }

  function _burn(address account, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
  {
    super._burn(account, amount);
  }
}