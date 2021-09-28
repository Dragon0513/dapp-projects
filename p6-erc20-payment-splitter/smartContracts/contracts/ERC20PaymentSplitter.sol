// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ApiToken.sol";

contract ERC20PaymentSplitter is Context {
  event PaymentReceived(address from, uint256 amount);
  event PaymentReleased(address to, uint256 amount);

  struct Receipt {
    uint32 inBlock;
    uint256 amount;
    uint224 totalShares;
    address from;
  }
  struct Payment {
    uint32 inBlock;
    uint256 amount;
  }

  Receipt[] private _received;
  mapping(address => uint256) private _totalReceivedFrom;
  uint256 _totalReceived;

  mapping(address => Payment[]) private _payments;
  mapping(address => uint256) private _totalReleasedTo;
  uint256 private _totalReleased;

  ApiToken private _shareToken;
  ERC20 private _paymentToken;

  constructor(
    ApiToken shareToken_,
    ERC20 paymentToken_
  ) {
    _shareToken = shareToken_;
    _paymentToken = paymentToken_;
  }

  function totalShares() public view returns (uint256) {
    return _shareToken.totalSupply();
  }

  function sharesOf(address payee) public view returns (uint256) {
    return _shareToken.balanceOf(payee);
  }

  function totalReleased() public view returns (uint256) {
    return _totalReleased;
  }

  function totalReleasedTo(address payee) public view returns (uint256) {
    return _totalReleasedTo[payee];
  }

  function releasedToData(address payee, uint256 index)
    public view returns (Payment memory)
  {
    require(
      _payments[payee].length > 0,
      "ERC20PaymentSplitter: no payments for the given account."
    );
    return _payments[payee][index];
  }

  function totalReceived() public view returns (uint256) {
    return _totalReceived;
  }

  function totalReceivedFrom(address payer) public view returns (uint256) {
    return _totalReceivedFrom[payer];
  }

  function receiveData(uint256 index) public view returns (Receipt memory) {
    return _received[index];
  }

  function paymentPending(address payee)
    public view returns(uint256 currentPayment)
  {
    Payment[] storage payments = _payments[payee];
    uint32 lastPaymentBlock = payments.length == 0 ? 1 : payments[payments.length - 1].inBlock;

    for (uint256 i = _received.length; i > 0; --i) {
      uint32 receiptBlock = _received[i - 1].inBlock;
      // Edge Case: lastPaymentBlock == receiptBlock
      if (lastPaymentBlock > receiptBlock) {
        break;
      }
      uint224 sharesInReceiptBlock = _shareToken.shares(payee, receiptBlock);
      currentPayment += (_received[i - 1].amount * sharesInReceiptBlock) / _received[i - 1].totalShares;
    }
  }

  function receivePayment(address sender, uint256 amount) external {
    require(amount > 0, "ERC20PaymentSplitter: receiving zero tokens.");
    _paymentToken.transferFrom(sender, address(this), amount);
    emit PaymentReceived(sender, amount);
    
    _totalReceived += amount;
    _totalReceivedFrom[sender] += amount;
    uint32 currentBlock = SafeCast.toUint32(block.number);
    _received.push(Receipt({
      inBlock: currentBlock,
      amount: amount,
      totalShares: SafeCast.toUint224(totalShares()),
      from: sender
    }));
  }

  function release() public virtual {
    address payee = _msgSender();
    require(sharesOf(payee) > 0, "ERC20PaymentSplitter: account has no shares");

    uint256 payment = paymentPending(payee);
    require(payment > 0, "ERC20PaymentSplitter: account is not due any payment");

    _payments[payee].push(Payment({
      inBlock: SafeCast.toUint32(block.number),
      amount: payment
    }));
    _totalReleasedTo[payee] += payment;
    _totalReleased += payment;

    _paymentToken.transfer(payee, payment);
    emit PaymentReleased(payee, payment);
  }
}
