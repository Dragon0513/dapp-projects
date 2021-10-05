//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IInbox.sol";

contract Deposit {
  IInbox public inbox;

  constructor(address _inbox) {
    inbox = IInbox(_inbox);
  }

  function depositEther(uint256 _maxSubmissionCost) public payable {
    inbox.createRetryableTicket{ value: msg.value }(
      msg.sender,         // destAddr
      0,                  // arbTxCallValue
      _maxSubmissionCost, // maxSubmissionCost
      msg.sender,         // submissionRefundAddress
      msg.sender,         // valueRefundAddress
      0,                  // maxGas
      0,                  // gasPriceBid
      "0x"                // data
    );
  }
}