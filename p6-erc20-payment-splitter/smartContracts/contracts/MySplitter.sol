// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20PaymentSplitter.sol";

contract MySplitter is ERC20PaymentSplitter {
  constructor(ERC20Shares sharesToken_, ERC20 paymentToken_)
    ERC20PaymentSplitter(sharesToken_, paymentToken_)
  {}
}