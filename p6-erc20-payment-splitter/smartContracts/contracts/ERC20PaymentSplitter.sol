// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC20Shares.sol";

/**
 * @title PaymentSplitter
 * @dev This contract allows to split ERC20 payments among a group of accounts.
 * The sender does not need to be aware that the payments will be split in this
 * way, since it is handled transparently by the contract.
 *
 * The payments are received and released in the form of an {ERC20} token. While
 * the split is done proportional to the percentage holdings of an {ERC20Shares}
 * token. Whenever the contract receives (or pays) {ERC20} tokens, it
 * increaments the sanpshot id in the {ERC20Shares} contract, and saves the new
 * snapshot id along with the `amount` of tokens received (or paid) and the
 * `from` address (or `to` address when paying). Any {ERC20Shares} token holder
 * can get his share of payment proportional to his holdings of {ERC20Shares}
 * token at the time payment was received by this contract. 
 *
 * {ERC20PaymentSplitter} follows a _pull payment_ model. This means that
 * payments are not automatically forwarded to the accounts but kept in this
 * contract, and the actual transfer is triggered as a separate step by calling
 * the {releasePayment} function.
 *
 * Note In order to receive or release payments, {ERC20PaymentSplitter} needs to
 * increament the snapshot id in the {ERC20Shares} token. For this
 * {ERC20PaymentSplitter} needs {SNAPSHOT_CREATOR} role in {ERC20Shares}. So,
 * after deploying it, grant it {SNAPSHOT_CREATOR} role in {ERC20Shares} token.
 *
 * Note In case, this contract receives any {ERC20} tokens other than the token
 * set for payments (set at build time), the owner of the contract can call
 * {drainTokens} function to transfer them to some address.
 */
abstract contract ERC20PaymentSplitter is Context, Ownable, ReentrancyGuard {
    struct Received {
        uint256 snapshotId;
        uint256 amount;
        address from;
    }
    struct Payment {
        uint256 snapshotId;
        uint256 amount;
        address to;
    }

    Received[] private _received;
    mapping(address => uint256) private _totalReceivedFrom;
    uint256 private _totalReceived;

    mapping(address => Payment[]) private _payments;
    mapping(address => uint256) private _totalPaidTo;
    uint256 private _totalPaid;

    ERC20Shares immutable private _sharesToken;
    ERC20 immutable private _paymentToken;

    /**
     * @dev Emitted when a payment is received.
     * @param from Address from which payment is received.
     * @param amount Amount of `_paymentToken` received.
     */
    event PaymentReceived(address from, uint256 amount);
    /**
     * @dev Emitted when a payment is released.
     * @param to Address to which payment is released.
     * @param amount Amount of `_paymentToken` released.
     */
    event PaymentReleased(address to, uint256 amount);

    /**
     * @dev Set the values for {_sharesToken} and {_paymentToken}.
     * @param sharesToken_ Address of the {ERC20Shares} token to use.
     * @param paymentToken_ Address of the {ERC20} token to use.
     *
     * Note All two of these values are immutable: they can only be set once
     * during construction.
     */
    constructor(ERC20Shares sharesToken_, ERC20 paymentToken_) {
        _sharesToken = sharesToken_;
        _paymentToken = paymentToken_;
    }

    /**
     * @dev Get the total amount of `_paymentToken` released so far.
     */
    function totalPaid() public view returns (uint256) {
        return _totalPaid;
    }

    /**
     * @dev Get the total amount of `_paymentToken` released to `payee` so far.
     * @param payee Address for which total paid amount is desired.
     */
    function totalPaidTo(address payee) public view returns (uint256) {
        return _totalPaidTo[payee];
    }

    /**
     * @dev Get the total number of payments released to `payee` so far.
     */
    function releasedPaymentsCount(address payee) public view returns (uint256) {
        return _payments[payee].length;
    }

    /**
     * @dev Get the `pos`-th released payment to `payee`.
     * @param payee Address for which payment data is desired.
     * @param pos Index of the released payment.
     *
     * Requirements:
     *
     * - `pos` must be a valid index.
     */
    function releasedPaymentsData(address payee, uint256 pos) public view returns (Payment memory) {
        require(pos < releasedPaymentsCount(payee), "ERC20PaymentSplitter: out of bounds index.");
        return _payments[payee][pos];
    }

    /**
     * @dev Get the total amount of `_paymentToken` received so far.
     */
    function totalReceived() public view returns (uint256) {
        return _totalReceived;
    }

    /**
     * @dev Get the total amount of `_paymentToken` received from `payer` so far.
     * @param payer Address for which total received amount is desired.
     */
    function totalReceivedFrom(address payer) public view returns (uint256) {
        return _totalReceivedFrom[payer];
    }

    /**
     * @dev Returns the number of payments received so far.
     */
    function receivedPaymentsCount() public view returns (uint256) {
        return _received.length;
    }

    /**
     * @dev Get the `pos`-th received payment.
     * @param pos Index of the received payment.
     *
     * Requirements:
     *
     * - `pos` must be a valid index.
     */
    function receivedPaymentsData(uint256 pos) public view returns (Received memory) {
        require(pos < receivedPaymentsCount(), "ERC20PaymentSplitter: out of bounds index.");
        return _received[pos];
    }

    /**
     * @dev Get the pending payment for `payee`.
     * @param payee Address for which pending payment is desired.
     */
    function paymentPending(address payee) public view returns(uint256 currentPayment) {
        Payment[] storage payments = _payments[payee];
        uint256 lastPaymentSnapshot = payments.length == 0 ? 0 : payments[payments.length - 1].snapshotId;

        for (uint256 i = _received.length; i > 0; --i) {
            uint256 receiveSnapshot = _received[i - 1].snapshotId;
            if (lastPaymentSnapshot > receiveSnapshot) {
                break;
            }
            uint256 sharesInReceiveSnapshot = _sharesToken.getPastShares(payee, receiveSnapshot);
            uint256 totalSharesInReceiveSnapshot = _sharesToken.getPastTotalShares(receiveSnapshot);
            currentPayment += (_received[i - 1].amount * sharesInReceiveSnapshot) / totalSharesInReceiveSnapshot;
        }
    }

    /**
     * @dev Receives `_paymentToken` from `sender`.
     * @param sender Address of the sender.
     * @param amount Amount of tokens to receive.
     *
     * Emits a {PaymentReceived} event.
     * Emits a {Snapshot} event on {ERC20Shares} contract.
     *
     * Requirements:
     *
     * - Total shares must be non-zero at the time of receiving payment. Else,
     *   payment will get locked in this contract forever with no one to claim
     *   it.
     * - `amount` must be non-zero.
     * - Sender must have already allowed {ERC20PaymentSplitter} to draw
     *   `amount` tokens from `sender` address.
     * - This contract must have {SNAPSHOT_CREATOR} role in {ERC20Shares}.
     */
    function receivePayment(address sender, uint256 amount) external {
        require(_sharesToken.getTotalShares() > 0, "ERC20PaymentSplitter: no share holder");
        require(amount > 0, "ERC20PaymentSplitter: receiving zero tokens.");
        _paymentToken.transferFrom(sender, address(this), amount);
        emit PaymentReceived(sender, amount);
        
        _totalReceived += amount;
        _totalReceivedFrom[sender] += amount;
        uint256 nextSnapshotId = _sharesToken.createSnapshot();
        _received.push(Received({
            snapshotId: nextSnapshotId,
            amount: amount,
            from: sender
        }));
    }

    /**
     * @dev Releases payment (if any) to the sender of the call.
     *
     * Emits a {PaymentReleased} event.
     * Emits a {Snapshot} event on {ERC20Shares} contract.
     *
     * Requirements:
     *
     * - Sender must have non-zero pending payment.
     * - This contract must have {SNAPSHOT_CREATOR} role in {ERC20Shares}.
     */
    function releasePayment() public virtual nonReentrant {
        address payee = _msgSender();
        uint256 payment = paymentPending(payee);
        require(payment > 0, "ERC20PaymentSplitter: account is not due any payment");

        _paymentToken.transfer(payee, payment);
        emit PaymentReleased(payee, payment);

        _totalPaid += payment;
        _totalPaidTo[payee] += payment;
        uint256 nextSnapshotId = _sharesToken.createSnapshot();
        _payments[payee].push(Payment({
            snapshotId: nextSnapshotId,
            amount: payment,
            to: payee
        }));
    }

    /**
     * @dev Sends {ERC20} tokens other than the `_paymentToken` to a given address.
     * @param token Address of the ERC20 token.
     * @param to Address to which the tokens are to be transferred.
     * @param amount Amount of tokens to transfer.
     *
     * Requirements:
     *
     * - Only the owner of the contract can call this.
     * - `token` must not be the same as `_paymentToken`.
     */
    function drainTokens(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(_paymentToken), "ERC20PaymentSplitter: can't drain the payment token.");

        IERC20(token).transfer(to, amount);
    }
}
