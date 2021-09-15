// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyDex {
  IERC20 myToken;
  uint256 public immutable convertionRate;

  event Bought(address indexed by, uint256 amount);
  event Sold(address indexed by, uint256 amount);

  constructor(address _tokenAddress) {
    myToken = IERC20(_tokenAddress);
    convertionRate = 1000;
  }

  function ethToTokens(uint256 _eths) private view returns(uint256 _tokens) {
    _tokens = _eths * convertionRate;
  }

  function tokensToEth(uint256 _tokens) private view returns(uint256 _eths) {
    _eths = _tokens / convertionRate;
  }

  function buy() external payable {
    uint256 ethSent = msg.value;
    require(ethSent > 0, "You need to send some ether");

    uint256 tokensRequired = ethToTokens(ethSent);
    uint256 dexBalance = myToken.balanceOf(address(this));
    require(tokensRequired <= dexBalance, "Not enough tokens in DEX!");

    myToken.transfer(msg.sender, tokensRequired);

    emit Bought(msg.sender, tokensRequired);
  }

  function sell(uint256 _amount) external {
    require(_amount > 0, "You need to sell some tokens.");

    uint256 allowance = myToken.allowance(msg.sender, address(this));
    require(_amount <= allowance, "You need to give us allowance at least as much you want to sell!");
    myToken.transferFrom(msg.sender, address(this), _amount);

    uint256 inEth = tokensToEth(_amount);
    payable(msg.sender).transfer(inEth);

    emit Sold(msg.sender, _amount);
  }
}
