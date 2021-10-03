// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title ERC20Shares
 * @dev Extension of ERC20 to support tracking of shares (balances) of holders
 * and totalShares (totalSupply) of the token. Uses {ERC20Snapshot} under the
 * hood. Shares can be queried through the public accessors {getShares} and
 * {getPastShares}. Total shares can be queried through the public accessors
 * {getTotalShares} and {getPastTotalShares}.
 *
 * This token can be used in conjunction with {ERC20PaymentSplitter} to split
 * incoming payments (in the form of an ERC20 token) among the holders of
 * {ERC20Shares} token. To make {ERC20PaymentSplitter} work properly, it needs
 * to create snapshots using the function {_snapshot} of {ERC20Snapshot}. But
 * exposing {_snapshot} publically can be dangerous. So, this contract uses
 * {AccessControl} to allow creating snapshots to only those who have
 * {SNAPSHOT_CREATOR} role.
 *
 * After deploying, {ERC20Shares} both the contract itself and the contract
 * deployer will have the {ERC20_SHARES_ADMIN_ROLE} role. The deployer can,
 * then, assign the {SNAPSHOT_CREATOR} role to the deployed
 * {ERC20PaymentSplitter}. After this, the contract deployer should renounce his
 * {ERC20_SHARES_ADMIN_ROLE} role for transparency.
 */
abstract contract ERC20Shares is 
    Context,
    ERC20,
    ERC20Permit,
    ERC20Snapshot,
    AccessControl
{
    bytes32 public constant ERC20_SHARES_ADMIN_ROLE = 
        keccak256("ERC20_SHARES_ADMIN_ROLE");
    bytes32 public constant SNAPSHOT_CREATOR = keccak256("SNAPSHOT_CREATOR");

    /**
     * @dev Assigns {ERC20_SHARES_ADMIN_ROLE} role to the deployer and the
     * contract itself.
     */
    constructor() {
        _setRoleAdmin(ERC20_SHARES_ADMIN_ROLE, ERC20_SHARES_ADMIN_ROLE);
        _setRoleAdmin(SNAPSHOT_CREATOR, ERC20_SHARES_ADMIN_ROLE);

        // deployer + self administration
        _setupRole(ERC20_SHARES_ADMIN_ROLE, _msgSender());
        _setupRole(ERC20_SHARES_ADMIN_ROLE, address(this));
    }

    /**
     * @dev Get the current snapshot id.
     */
    function currentSnapshotId() public view returns (uint256) {
        return _getCurrentSnapshotId();
    }

    /**
     * @dev Increment the snapshot id and returns the new snapshot id.
     *
     * Emits a {Snapshot} event for the new snapshot id.
     *
     * Requirements:
     *
     * - The caller must have {SNAPSHOT_CREATOR} role.
     */
    function createSnapshot()
        external onlyRole(SNAPSHOT_CREATOR) returns (uint256)
    {
        return _snapshot();
    }

    /**
     * @dev Get the shares currently held by `account`. 
     * @param account Address whose current shares are desired.
     */
    function getShares(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    /**
     * @dev Get the shares held by `account` before `snapshotId`.
     * @param account Address whose past shares are desired.
     * @param snapshotId Snapshot id before which past shares are desired.
     *
     * Requirements:
     *
     * - `snapshotId` must be greater than 0.
     * - `snapshotId` must be less than or equal to the current snapshotId.
     */
    function getPastShares(address account, uint256 snapshotId)
        public view returns (uint256)
    {
        return balanceOfAt(account, snapshotId);
    }

    /**
     * @dev Get the total number of shares currently. Uses {totalSupply} of
     * {ERC20} under the hood.
     */
    function getTotalShares() public view returns (uint256) {
        return totalSupply();
    }

    /**
     * @dev Get the total number of shares before `snapshotId`.
     * @param snapshotId Snapshot id before which total shares are desired.
     *
     * Requirements:
     *
     * - `snapshotId` must be greater than 0.
     * - `snapshotId` must be less than or equal to the current snapshotId.
     */
    function getPastTotalShares(uint256 snapshotId) 
        public view returns (uint256)
    {
        return totalSupplyAt(snapshotId);
    }

    /**
     * @dev Override for linearization purpose only.
     * @param from Address tokens are transferred from.
     * @param to Address tokens are transferred to.
     * @param amount Amount of tokens transferred.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal virtual override(ERC20, ERC20Snapshot)
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
