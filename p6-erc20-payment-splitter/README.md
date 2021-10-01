# ERC20 Payment Splitter

This app is a demo app for ERC20 Payment Splitter. The code for the
contracts can be found [here](https://github.com/SharjeelSafdar/dapp-projects/tree/main/p6-erc20-payment-splitter/smartContracts/contracts). The contracts have been deployed to Ropsten. Please, open an issue [here](https://github.com/SharjeelSafdar/dapp-projects/issues) if you find any problem or have a suggestion.

There is already a Payment Splitter for ETH on [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol). There are many people who have implemented an ERC20 payment splitter
to split a payment among share holders in the form of an ERC20 token by
modifying OpenZeppelin's payment splitter for ETH. An example is [AirSwap](https://github.com/airswap/airswap-protocols/blob/main/source/converter/contracts/TokenPaymentSplitter.sol).

So, how this ERC20 payment splitter is different. Most of the ERC20
payment splitter implementations (at least those I encountered) split
the payments among a given list of accounts in proportion to their fixed
shares.

This ERC20 payment splitter uses two ERC20 tokens. One token is the **Payment Token** which is used for receiving and splitting payments.
The other is the **Shares Token**. Shares token ([ERC20Shares](https://github.com/SharjeelSafdar/dapp-projects/blob/main/p6-erc20-payment-splitter/smartContracts/contracts/ERC20Shares.sol)) is also an ERC20 token with some extended functionality. It snapshots
its holders' balances and the total supply of the token when they
change. The ERC20 Payment Splitter uses these balance snapshots and the
total supply snapshots as the shares held by addresses and the total
shares respectively at different points of time. Whenever a payment is
received, each user gets a part of the payment in proportion to her/his
balance of Shares Token. However, the user doesn't receive the payment
automatically. The user can get all the accumulated pending payments
anytime.

## Benefits

1.  There is no need to add or remove share holders.
2.  The share holders can exchange their shares at a DEX.
3.  The same token can be used for both share holding in a payment
    splitter and governance on a DAO.

## Limitations

1.  The sender of the payment has to first allow the splitter to get the
    Payment Token from his/her address, and then, call the receivePayment
    function on the splitter.
2.  The share holders have to manually withdraw their payments.

## Contract Links

1.  [ERC20PaymentSplitter](https://ropsten.etherscan.io/address/0xAc82650FBFEAE0Ec257d6a683A08c8F9F7009Abb)
2.  [ERC20Shares](https://ropsten.etherscan.io/address/0xf3C0e3b8D4c8FC65a40d288D89e40721A219acA6)
3.  [FakeDai](https://ropsten.etherscan.io/address/0x6A6667C9534E1A2722696536a02ee88f0C4105Ab)
