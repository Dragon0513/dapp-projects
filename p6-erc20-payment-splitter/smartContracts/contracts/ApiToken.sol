// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract ApiToken is ERC20, ERC20Permit, ERC20Votes {
  struct SharesCheckpoint {
    uint32 fromBlock;
    uint224 shares;
  }
  enum OP {
    ADD,
    SUB
  }

  mapping(address => SharesCheckpoint[]) private _sharesCheckpoints;

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

  function _writeSharesCheckpoint(
    address account,
    uint256 delta,
    OP op
  ) private
  {
    if (account == address(0)) return;
    require(delta > 0, "ApiToken: no change in shares.");
    require(op == OP.ADD || op == OP.SUB, "ApiToken: unsupported operation while writing checkpoint.");

    SharesCheckpoint[] storage ckpts = _sharesCheckpoints[account];
    uint256 pos = ckpts.length;
    uint256 oldShares = pos == 0 ? 0 : ckpts[pos - 1].shares;
    uint256 newShares = op == OP.ADD ? oldShares + delta : oldShares - delta;

    // A gaurd to avoid writing two checkpoints in the same block.
    if (pos > 0 && ckpts[pos - 1].fromBlock == block.number) {
      ckpts[pos - 1].shares = SafeCast.toUint224(newShares);
    } else {
      ckpts.push(SharesCheckpoint({
        fromBlock: SafeCast.toUint32(block.number),
        shares: SafeCast.toUint224(newShares)
      }));
    }
  }

  function shares(address account, uint32 blockNumber)
    public view returns(uint224)
  {
    return _sharesCheckpointsLookup(_sharesCheckpoints[account], blockNumber);
  }

  function currentShares(address account) public view returns (uint224) {
    return _sharesCheckpointsLookup(_sharesCheckpoints[account], block.number);
  }

  /**
   * @dev Lookup a value in a list of (sorted) checkpoints.
   */
  function _sharesCheckpointsLookup(
    SharesCheckpoint[] storage ckpts,
    uint256 blockNumber
  ) private view returns (uint224)
  {
    // We run a binary search to look for the earliest checkpoint taken after `blockNumber`.

    // During the loop, the index of the wanted checkpoint remains in the range [low-1, high).
    // With each iteration, either `low` or `high` is moved towards the middle of the range to maintain the invariant.
    // - If the middle checkpoint is after `blockNumber`, we look in [low, mid)
    // - If the middle checkpoint is before or equal to `blockNumber`, we look in [mid+1, high)
    // Once we reach a single value (when low == high), we've found the right checkpoint at the index high-1, if not
    // out of bounds (in which case we're looking too far in the past and the result is 0).
    // Note that if the latest checkpoint available is exactly for `blockNumber`, we end up with an index that is
    // past the end of the array, so we technically don't find a checkpoint after `blockNumber`, but it works out
    // the same.
    uint256 high = ckpts.length;
    uint256 low = 0;
    while (low < high) {
      uint256 mid = Math.average(low, high);
      if (ckpts[mid].fromBlock > blockNumber) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    return high == 0 ? 0 : ckpts[high - 1].shares;
  }

  function _afterTokenTransfer(address from, address to, uint256 amount)
    internal override(ERC20, ERC20Votes)
  {
    super._afterTokenTransfer(from, to, amount);

    _writeSharesCheckpoint(from, amount, OP.SUB);
    _writeSharesCheckpoint(to, amount, OP.ADD);
  }

  function _mint(address account, uint256 amount)
    internal override(ERC20, ERC20Votes)
  {
    super._mint(account, amount);
  }

  function _burn(address account, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
  {
    super._burn(account, amount);
  }
}
