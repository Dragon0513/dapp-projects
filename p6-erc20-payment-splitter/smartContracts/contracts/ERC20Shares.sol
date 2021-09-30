// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";

/**
 * @title ERC20Shares
 * @dev Extension of ERC20 to support tracking of shares (balances) of holders.
 *
 * This extension keeps a history (checkpoints) of each account's shares (balances).
 * Shares can be queried through the public accessors {getShares} and {getPastShares}.
 *
 * _Available since v4.x._
 */
abstract contract ERC20Shares is ERC20, ERC20Permit {
    using Arrays for uint256[];

    struct SharesCheckpoints {
        uint256[] fromBlocks;
        uint256[] shares;
    }
    enum OP {
        ADD,
        SUB
    }

    mapping(address => SharesCheckpoints) private _sharesCheckpoints;
    SharesCheckpoints _totalSharesCheckpoints;

    /**
     * @dev Emitted when a token transfer, minting or burning results in changes to an account's shares.
     * @param account Address whose shares have changed.
     * @param oldShares Old shares of `account`.
     * @param newShares New shares of `account`.
     */
    event SharesChanged(address indexed account, uint256 oldShares, uint256 newShares);

    /**
     * @dev Get the `pos`-th shares checkpoint for `account`.
     * @param account Address whose shares checkpoint is desired.
     * @param pos Index of the shares checkpoint.
     */
    function sharesCheckpoints(address account, uint256 pos)
        public view virtual returns (uint256 fromBlock, uint256 shares)
    {
        fromBlock = _sharesCheckpoints[account].fromBlocks[pos];
        shares = _sharesCheckpoints[account].shares[pos];
    }

    /**
     * @dev Get number of shares checkpoints for `account`.
     * @param account Address whose number of shares checkpoints are desired.
     */
    function numSharesCheckpoints(address account)
        public view virtual returns (uint256)
    {
        return _sharesCheckpoints[account].fromBlocks.length;
    }

    /**
    * @dev Get the shares currently held by `account`. 
    * @param account Address whose current shares are desired.
    */
    function getShares(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    /**
    * @dev Get the shares held by `account` in `blockNumber`.
    * @param account Address whose past shares are desired.
    * @param blockNumber Block number for which past shares are desired.
    *
    * Requirements:
    *
    * - `blockNumber` must have been already mined
    */
    function getPastShares(address account, uint256 blockNumber)
        public view returns (uint256)
    {
        require(blockNumber <= block.number, "ERC20Shares: block not yet mined");
        if (blockNumber == block.number) {
            return getShares(account);
        }
        uint256 pos = _sharesCheckpoints[account].fromBlocks.findUpperBound(blockNumber);
        return _sharesCheckpoints[account].shares[pos];
    }

    /**
     * @dev Get the total number of shares currently. Uses {totalSupply} of
     * {ERC20} under the hood.
     */
    function getTotalShares() public view returns (uint256) {
        return totalSupply();
    }

    /**
     * @dev Get the total number of shares in `blockNumber`.
     * @param blockNumber Block number for which total shares are desired.
     *
     * Requirements:
     *
     * - `blockNumber` must have been already mined
     */
    function getPastTotalShares(uint256 blockNumber) 
        public view returns (uint256)
    {
        require(blockNumber <= block.number, "ERC20Shares: block not yet mined");
        if (blockNumber == block.number) {
            return getTotalShares();
        }
        uint256 pos = _totalSharesCheckpoints.fromBlocks.findUpperBound(blockNumber);
        return _totalSharesCheckpoints.shares[pos];
    }

    /**
    * @dev Writes checkpoints for `from` and `to` accounts whenever shares (tokens) are transferred.
    * @param from Address tokens are transferred from.
    * @param to Address tokens are transferred to.
    * @param amount Amount of tokens transferred.
    *
    * Emits a {SharesChanged} event for both accounts.
    */
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal virtual override
    {
        super._afterTokenTransfer(from, to, amount);

        _moveShares(from, to, amount);
    }

    /**
     * @dev Snapshots the totalShares (totalSupply) after it has been increased.
     * @param account Address the minted tokens are sent to.
     * @param amount Amount of tokens minted.
     */
    function _mint(address account, uint256 amount) internal virtual override {
        super._mint(account, amount);

        _writeSharesCheckpoint(_totalSharesCheckpoints, OP.ADD, amount);
    }

    /**
     * @dev Snapshots the totalShares (totalSupply) after it has been decreased.
     * @param account Address the tokens are burnt from.
     * @param amount Amount of tokens burnt.
     */
    function _burn(address account, uint256 amount) internal virtual override {
        super._burn(account, amount);

        _writeSharesCheckpoint(_totalSharesCheckpoints, OP.SUB, amount);
    }

    /**
     * @dev Writes checkpoints for new shares of `src` and `dst` accounts after
     * a token transfer.
     * @param src Address the tokens are transferred from.
     * @param dst Address the tokens are transferred to.
     * @param amount Amount of tokens transferred.
     */
    function _moveShares(address src, address dst, uint256 amount) private {
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
    * @dev Writes checkpoints when a change in shares occurs.
    * @param ckpts Array of checkpoints to which a new checkpoint will be added.
    * @param op Whether to increase (`ADD`) or decrease (`SUB`) the shares. See `OP` enum.
    * @param delta Amount of change in shares.
    */
    function _writeSharesCheckpoint(
        SharesCheckpoints storage ckpts,
        OP op,
        uint256 delta
    ) private returns (uint256 oldShares, uint256 newShares) {
        require(op == OP.ADD || op == OP.SUB, "ERC20Shares: unsupported operation while writing checkpoint.");

        uint256 pos = ckpts.fromBlocks.length;
        oldShares = pos == 0 ? 0 : ckpts.shares[pos - 1];
        newShares = op == OP.ADD ? oldShares + delta : oldShares - delta;

        // A gaurd to avoid writing two checkpoints in the same block.
        if (pos > 0 && ckpts.fromBlocks[pos - 1] == block.number) {
            ckpts.shares[pos - 1] = newShares;
        } else {
            ckpts.fromBlocks.push(block.number);
            ckpts.shares.push(newShares);
        }
    }
}
