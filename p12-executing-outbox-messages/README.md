# Executing Outbox Messages

The Outbox contract is responsible for receiving and executing all "outgoing" messages; i.e., messages passed from Arbitrum to Ethereum.

The most-common use-case is withdrawals (of Ether or tokens), but the Outbox handles any arbitrary contract call, as this demo illustrates.

## Transaction Links

1.  [Receiving 0.001 ETH Withdrawn from L2 (Using ArbSys) | Rinkeby](https://rinkeby.etherscan.io/tx/0xa081545a793ff32e0ec3943db088deed258ee09e7dd82c7f445543ece768b4c0)
2.  [Receiving 0.001 ETH Withdrawn from L2 (Using DApp) | Rinkeby](https://rinkeby.etherscan.io/tx/0xf48eeb7eaec144dc3725da90ff7e8d7ecb58ac971fa09ab5c15a202e54c7cb87)
