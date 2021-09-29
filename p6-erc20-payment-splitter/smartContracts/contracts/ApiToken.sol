// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "./ERC20Shares.sol";

contract ApiToken is ERC20, ERC20Permit, ERC20Votes, ERC20Shares {
  constructor(
    string memory name_,
    string memory symbol_,
    address[] memory shareHolders_
  )
    ERC20(name_, symbol_)
    ERC20Permit(name_)
  {
    require(shareHolders_.length > 0, "ApiToken: Provide at least one shareholder.");

    for (uint i = 0; i < shareHolders_.length; ++i) {
      _mint(shareHolders_[i], 1000 * 10 ** decimals());
    }
  }

  function _afterTokenTransfer(address from, address to, uint256 amount)
    internal override(ERC20, ERC20Votes, ERC20Shares)
  {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address account, uint256 amount)
    internal override(ERC20, ERC20Votes, ERC20Shares)
  {
    super._mint(account, amount);
  }

  function _burn(address account, uint256 amount)
    internal override(ERC20, ERC20Votes, ERC20Shares)
  {
    super._burn(account, amount);
  }
}
