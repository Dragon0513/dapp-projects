// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";
import "@chainlink/contracts/src/v0.8/Denominations.sol";

contract FeedRegistryConsumer {
  FeedRegistryInterface internal registry;

  /**
   * Network: Ethereum Kovan
   * Feed Registry: 0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0
   */
  constructor() {
    registry = FeedRegistryInterface(0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0);
  }

  /**
   * @dev Returns ETH / USD price.
   */
  function getLatestEthUsdPrice() public view returns (
    uint80 roundId,
    int price,
    uint startedAt,
    uint timestamp,
    uint80 answeredInRound
  ) {
    (
      roundId,
      price,
      startedAt,
      timestamp,
      answeredInRound
    ) = registry.latestRoundData(Denominations.ETH, Denominations.USD);
  }

  /**
   * @dev Returns historical ETH / USD price for a given round id.
   * @param _roundId A previous round id.
   * Note Timestamp returned by the registry is zero for an invalid round id.
   * The function will revert if the timestamp is zero.
   */
  function getHistoricalEthUsdPrice(uint80 _roundId) public view returns (
    uint80 roundId,
    int price,
    uint startedAt,
    uint timestamp,
    uint80 answeredInRound
  ) {
    (
      roundId,
      price,
      startedAt,
      timestamp,
      answeredInRound
    ) = registry.getRoundData(Denominations.ETH, Denominations.USD, _roundId);
    require(timestamp > 0, "Round not completed!");
  }

  /**
   * @dev Returns latest price of `base` in `quote`.
   * @param base Currency whose price is required.
   * @param quote Currency in which price of `base` is required.
   */
  function getLatestPrice(address base, address quote) public view returns (
    uint80 roundId,
    int price,
    uint startedAt,
    uint timestamp,
    uint80 answeredInRound
  ) {
    (
      roundId,
      price,
      startedAt,
      timestamp,
      answeredInRound
    ) = registry.latestRoundData(base, quote);
  }

  /**
   * @dev Returns historical price of `base` in `quote`.
   * @param base Currency whose price is required.
   * @param quote Currency in which price of `base` is required.
   */
  function getHistoricalPrice(address base, address quote, uint80 _roundId)
    public view returns (
    uint80 roundId,
    int price,
    uint startedAt,
    uint timestamp,
    uint80 answeredInRound
  ) {
    (
      roundId,
      price,
      startedAt,
      timestamp,
      answeredInRound
    ) = registry.getRoundData(base, quote, _roundId);
    require(timestamp > 0, "Round not completed!");
  }
}