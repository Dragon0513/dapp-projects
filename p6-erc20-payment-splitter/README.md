# ERC20 Payment Splitter

This app is a demo app for ERC20 Payment Splitter. The code for the
contracts can be found [here](https://github.com/SharjeelSafdar/dapp-projects/tree/main/p6-erc20-payment-splitter/smartContracts/contracts). The contracts have been deployed to Ropsten. Please, open an issue [here](https://github.com/SharjeelSafdar/dapp-projects/issues) if you find any problem or have a suggestion.

There is already a Payment Splitter for ETH on [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol). There are many people who have implemented an ERC20 payment splitter to split a payment among shareholders in the form of an ERC20 token by modifying OpenZeppelin's payment splitter for ETH. An example is [AirSwap](https://github.com/airswap/airswap-protocols/blob/main/source/converter/contracts/TokenPaymentSplitter.sol).

So, how this ERC20 payment splitter is different. Most of the ERC20 payment splitter implementations (at least those I encountered) split
the payments among a given list of accounts in proportion to their fixed shares.

This ERC20 payment splitter uses two ERC20 tokens. One token is the **Payment Token** which is used for receiving and splitting payments. The other is the **Shares Token**. Shares token ([ERC20Shares](https://github.com/SharjeelSafdar/dapp-projects/blob/main/p6-erc20-payment-splitter/smartContracts/contracts/ERC20Shares.sol)) is also an ERC20 token with some extended functionality. It snapshots its holders' balances and the total supply of the token when they change. The ERC20 Payment Splitter uses these balance snapshots and the total supply snapshots as the shares held by addresses and the total shares respectively at different points of time. Whenever a payment is received, each user gets a part of the payment in proportion to her/his balance of Shares Token at that point in time. However, the user doesn't receive the payment automatically. The user can get all the accumulated pending payments anytime.

## Benefits

1.  There is no need to add or remove shareholders.
2.  The shareholders can exchange their shares at a DEX.
3.  The same token can be used for both shareholding in a payment splitter and governance on a DAO.

## Limitations

1.  The sender of the payment has to first allow the splitter to get the Payment Token from his/her address, and then, call the receivePayment function on the splitter.
2.  The shareholders have to manually withdraw their payments.

## Contract Links

1.  [ERC20PaymentSplitter](https://ropsten.etherscan.io/address/0x3DaA249BCC64D6CB5F98424f190f7871B7c9dCcd)
2.  [ERC20Shares](https://ropsten.etherscan.io/address/0x4fB3433Ef5fB23a00e29351583f4c263799B9966)
3.  [FakeDai](https://ropsten.etherscan.io/address/0x445c1608B9bbF0A18098C92Ca72D5472D0c3afC3)
