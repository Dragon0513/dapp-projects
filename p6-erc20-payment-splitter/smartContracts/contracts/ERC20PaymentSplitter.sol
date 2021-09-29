// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC20Shares.sol";

abstract contract ERC20PaymentSplitter is Context, Ownable, ReentrancyGuard {
    struct Received {
        uint32 inBlock;
        uint256 amount;
        uint256 totalShares;
        address from;
    }
    struct Payment {
        uint32 inBlock;
        uint256 amount;
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
     * Note All two of these values are immutable: they can only be set once during construction.
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
     * @param payee address of `payee`.
     */
    function totalPaidTo(address payee) public view returns (uint256) {
        return _totalPaidTo[payee];
    }

    /**
     * @dev Get the total number of payments released to `payee` so far.
     */
    function paymentsCount(address payee) public view returns (uint256) {
        return _payments[payee].length;
    }

    /**
     * @dev Get the `pos`-th released payment to `payee`.
     * @param pos Index of the released payment.
     */
    function paymentsData(address payee, uint256 pos) public view returns (Payment memory) {
        require(
            _payments[payee].length > 0,
            "ERC20PaymentSplitter: no payments for the given account."
        );
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
     * @param payer address of `payer`.
     */
    function totalReceivedFrom(address payer) public view returns (uint256) {
        return _totalReceivedFrom[payer];
    }

    /**
     * @dev Returns the number of payments received so far.
     */
    function receiveCount() public view returns (uint256) {
        return _received.length;
    }

    /**
     * @dev Get the `pos`-th received payment.
     * @param pos Index of the received payment.
     */
    function receiveData(uint256 pos) public view returns (Received memory) {
        return _received[pos];
    }

    /**
     * @dev Get the pending payment for `payee`.
     * @param payee Address for which pending payment is desired.
     */
    function paymentPending(address payee) public view returns(uint256 currentPayment) {
        Payment[] storage payments = _payments[payee];
        uint32 lastPaymentBlock = payments.length == 0 ? 0 : payments[payments.length - 1].inBlock;

        for (uint256 i = _received.length; i > 0; --i) {
            uint32 receiptBlock = _received[i - 1].inBlock;
            // Edge Case: lastPaymentBlock == receiptBlock
            if (lastPaymentBlock > receiptBlock) {
                break;
            }
            uint224 sharesInReceiptBlock = SafeCast.toUint224(_sharesToken.getPastShares(payee, receiptBlock));
            currentPayment += (_received[i - 1].amount * sharesInReceiptBlock) / _received[i - 1].totalShares;
        }
    }

    /**
     * @dev Receives `_paymentToken` from `sender`.
     * @param sender Address of the sender.
     * @param amount Amount of tokens to receive.
     *
     * Requirements:
     *
     * - `amount` must be non-zero.
     * - Sender must have already allowed {ERC20PaymentSplitter} to draw `amount` tokens from `sender` address.
     */
    function receivePayment(address sender, uint256 amount) external {
        require(amount > 0, "ERC20PaymentSplitter: receiving zero tokens.");
        _paymentToken.transferFrom(sender, address(this), amount);
        emit PaymentReceived(sender, amount);
        
        _totalReceived += amount;
        _totalReceivedFrom[sender] += amount;
        uint32 currentBlock = SafeCast.toUint32(block.number);
        _received.push(Received({
            inBlock: currentBlock,
            amount: amount,
            totalShares: SafeCast.toUint224(_sharesToken.totalSupply()),
            from: sender
        }));
    }

    /**
     * @dev Releases payment (if any) to the sender of the call.
     *
     * Requirements:
     *
     * - Sender must be holding some `_sharesToken` tokens.
     * - Sender must have non-zero pending payment.
     */
    function releasePayment() public virtual nonReentrant {
        address payee = _msgSender();
        require(_sharesToken.getShares(payee) > 0, "ERC20PaymentSplitter: account has no shares");

        uint256 payment = paymentPending(payee);
        require(payment > 0, "ERC20PaymentSplitter: account is not due any payment");

        _payments[payee].push(Payment({
            inBlock: SafeCast.toUint32(block.number),
            amount: payment
        }));
        _totalPaidTo[payee] += payment;
        _totalPaid += payment;

        _paymentToken.transfer(payee, payment);
        emit PaymentReleased(payee, payment);
    }

    /**
     * @dev Sends ERC20 tokens other than the `_paymentToken` to a given address.
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
