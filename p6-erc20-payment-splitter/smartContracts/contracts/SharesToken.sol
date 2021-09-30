// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./ERC20Shares.sol";

contract SharesToken is Context, ERC20, ERC20Permit, ERC20Shares {
  address[] private _holders;

  constructor() ERC20("SharesToken", "SHA") ERC20Permit("SharesToken") {}

  function sendMe500Shares() external {
    _mint(_msgSender(), 500 * 10 ** decimals());
  }

  function getHolders() public view returns (address[] memory) {
    return _holders;
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal override
  {
    super._beforeTokenTransfer(from, to, amount);

    if (balanceOf(to) == 0) {
      _holders.push(to);
    }
  }
 
  function _afterTokenTransfer(address from, address to, uint256 amount)
    internal override(ERC20, ERC20Shares)
  {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address account, uint256 amount)
    internal override(ERC20, ERC20Shares)
  {
    super._mint(account, amount);
  }

  function _burn(address account, uint256 amount)
    internal override(ERC20, ERC20Shares)
  {
    super._burn(account, amount);
  }
}
