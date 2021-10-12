# Address Table

The Address table is a precompiled contract on Arbitrum for registering addresses which are then retrievable by an integer index; this saves gas by minimizing precious calldata required to input an address as a parameter.

This demo shows a simple contract with affordances to retrieve an address from a contract by its index in the address table, and a client-side script to pre-register the given address (if necessary).

## Deployed Contracts and Txns

1.  [ArbitrumVIP Contract Address | Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/address/0xc4c5168f7eE70A72c2bE131561F6A280031Dd340)
2.  [Contract Creation Txn | Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0x17a853bc90a534c4c0221eac525b08815135bf1d0b5410ca6f312ed844c65c81)
3.  [Adding VIP Points Txn | Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/tx/0x419c5d1dccde6768b4adaa79f1ecc539f8e76b07118b6ed766195c6472928347)
