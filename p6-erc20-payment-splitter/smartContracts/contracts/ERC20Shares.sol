// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

/**
 * @dev Extension of ERC20 to support tracking of shares (balances) of holders.
 *
 * This extension keeps a history (checkpoints) of each account's shares (balances).
 * Shares can be queried through the public accessors {getShares} and {getPastShares}.
 *
 * _Available since v4.x._
 */
abstract contract ERC20Shares is ERC20, ERC20Permit {
    struct SharesCheckpoint {
        uint32 fromBlock;
        uint256 shares;
    }
    enum OP {
        ADD,
        SUB
    }

    mapping(address => SharesCheckpoint[]) private _sharesCheckpoints;
    SharesCheckpoint[] _totalSharesCheckpoints;

    /**
     * @dev Emitted when a token transfer, minting or burning results in changes to an account's shares.
     */
    event SharesChanged(address indexed account, uint256 oldShares, uint256 newShares);

    /**
     * @dev Get the `pos`-th shares checkpoint for `account`.
     */
    function sharesCheckpoints(address account, uint32 pos) public view virtual returns (SharesCheckpoint memory) {
        return _sharesCheckpoints[account][pos];
    }

    /**
     * @dev Get number of shares checkpoints for `account`.
     */
    function numSharesCheckpoints(address account) public view virtual returns (uint32) {
        return SafeCast.toUint32(_sharesCheckpoints[account].length);
    }

    /**
    * @dev Returns the shares currently held by `account`. 
    */
    function getShares(address account) public view returns (uint256) {
        uint256 pos = _sharesCheckpoints[account].length;
        return pos == 0 ? 0 : _sharesCheckpoints[account][pos - 1].shares;
    }

    /**
    * @dev Returns the shares held by `account` in `blockNumber`. 
    *
    * Requirements:
    *
    * - `blockNumber` must have been already mined
    */
    function getPastShares(address account, uint32 blockNumber) public view returns (uint256) {
        require(blockNumber < block.number, "ERC20Shares: block not yet mined");
        return _sharesCheckpointsLookup(_sharesCheckpoints[account], blockNumber);
    }

    /**
    * @dev Writes checkpoints for `from` and `to` accounts whenever a shares (token) transfer occurs.
    *
    * Emits a {SharesChanged} event for both accounts.
    */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._afterTokenTransfer(from, to, amount);

        _moveShares(from, to, amount);
    }

    /**
     * @dev Snapshots the totalShares (totalSupply) after it has been increased.
     */
    function _mint(address account, uint256 amount) internal virtual override {
        super._mint(account, amount);

        _writeSharesCheckpoint(_totalSharesCheckpoints, OP.ADD, amount);
    }

    /**
     * @dev Snapshots the totalShares (totalSupply) after it has been decreased.
     */
    function _burn(address account, uint256 amount) internal virtual override {
        super._burn(account, amount);

        _writeSharesCheckpoint(_totalSharesCheckpoints, OP.SUB, amount);
    }

    function _moveShares(
        address src,
        address dst,
        uint256 amount
    ) private {
        if (src != dst && amount > 0) {
            if (src != address(0)) {
                (uint256 oldShares, uint256 newShares) = 
                    _writeSharesCheckpoint(_sharesCheckpoints[src], OP.SUB, amount);
                emit SharesChanged(src, oldShares, newShares);
            }

            if (dst != address(0)) {
                (uint256 oldShares, uint256 newShares) = 
                    _writeSharesCheckpoint(_sharesCheckpoints[dst], OP.ADD, amount);
                emit SharesChanged(dst, oldShares, newShares);
            }
        }
    }

    /**
    * @dev Writes checkpoints for `from` and `to` accounts whenever a shares (token) transfer occurs.
    */
    function _writeSharesCheckpoint(
        SharesCheckpoint[] storage ckpts,
        OP op,
        uint256 delta
    ) private returns (uint256 oldShares, uint256 newShares) {
        require(op == OP.ADD || op == OP.SUB, "ERC20Shares: unsupported operation while writing checkpoint.");

        uint256 pos = ckpts.length;
        oldShares = pos == 0 ? 0 : ckpts[pos - 1].shares;
        newShares = op == OP.ADD ? oldShares + delta : oldShares - delta;

        // A gaurd to avoid writing two checkpoints in the same block.
        if (pos > 0 && ckpts[pos - 1].fromBlock == block.number) {
            ckpts[pos - 1].shares = newShares;
        } else {
            ckpts.push(SharesCheckpoint({
                fromBlock: SafeCast.toUint32(block.number),
                shares: newShares
            }));
        }
    }

    /**
    * @dev Lookup a value in a list of (sorted) shares checkpoints.
    */
    function _sharesCheckpointsLookup(
        SharesCheckpoint[] storage ckpts,
        uint256 blockNumber
    ) private view returns (uint256) {
        // We run a binary search to look for the earliest checkpoint taken after `blockNumber`.
        //
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
}
