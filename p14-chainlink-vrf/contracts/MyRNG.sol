// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract MyRNG is VRFConsumerBase {
  bytes32 internal keyHash;
  uint256 internal fee;

  uint256 public randomResult;
  mapping(bytes32 => uint256) public results;

  event RequestMade(bytes32 indexed requestId);

  constructor() 
    VRFConsumerBase(
      0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B,
      0x01BE23585060835E02B77ef475b0Cc51aA1e0709
    )
  {
    keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    fee = 0.1e18;
  }

  /** 
   * @dev Requests randomness 
   */
  function getRandomNumber() public returns (bytes32) {
    require(LINK.balanceOf(address(this)) >= fee, "MyRNG: not enough LINK- fill contract with faucet");
    bytes32 requestId = requestRandomness(keyHash, fee);
    emit RequestMade(requestId);
    return requestId;
  }

  /**
   * @dev Callback function used by VRF Coordinator
   */
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    randomResult = randomness;
    results[requestId] = randomness;
  }
}
