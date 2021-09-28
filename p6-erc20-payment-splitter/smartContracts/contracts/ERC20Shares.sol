// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract ERC20Shares is ERC20, ERC20Permit {
    struct SharesCheckpoint {
        uint32 fromBlock;
        uint256 shares;
    }
    enum OP {
        ADD,
        SUB
    }

    mapping(address => SharesCheckpoint[]) private _sharesCheckpoints;

    event SharesChanged(address indexed account, uint256 oldShares, uint256 newShares);

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) ERC20Permit(name_) {}

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

        // No need to write a checkpoint for zero address.
        if (from != address(0)) {
            (uint256 oldShares, uint256 newShares) = _writeSharesCheckpoint(from, amount, OP.SUB);
            emit SharesChanged(from, oldShares, newShares);
        }
        // No need to write a checkpoint for zero address.
        if (to != address(0)) {
            (uint256 oldShares, uint256 newShares) = _writeSharesCheckpoint(to, amount, OP.ADD);
            emit SharesChanged(to, oldShares, newShares);
        }
    }

    function _mint(address account, uint256 amount) internal virtual override {
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual override {
        super._burn(account, amount);
    }

    /**
    * @dev Writes checkpoints for `from` and `to` accounts whenever a shares (token) transfer occurs.
    */
    function _writeSharesCheckpoint(
        address account,
        uint256 delta,
        OP op
    ) private returns (uint256 oldShares, uint256 newShares) {
        require(account != address(0), "ERC20Shares: writing checkpoint for zero address.");
        require(delta > 0, "ERC20Shares: no change in shares.");
        require(op == OP.ADD || op == OP.SUB, "ERC20Shares: unsupported operation while writing checkpoint.");

        SharesCheckpoint[] storage ckpts = _sharesCheckpoints[account];
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
