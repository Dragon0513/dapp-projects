# Arbitrum's Message Passing System

This is a simple demo of Arbitrum's L1-to-L2 message passing system (aka "retryable tickets").

It deploys 2 contracts - one to L1, and another to L2, and has the L1 contract send a message to the L2 contract to be executed automatically.

The script and contracts demonstrate how to interact with Arbitrum's core bridge contracts to create these retryable messages, how to calculate and forward appropriate fees from L1 to L2, and how to use Arbitrum's L1-to-L2 message address aliasing.

## Deployed Contracts and Txns

1.  [L1 Greeter | Rinkeby Explorer](https://rinkeby.etherscan.io/address/0x04A957A562D73b32077CD052Cd6449597C36D565)
2.  [L2 Greeter | Arbitrum Explorer](https://rinkeby-explorer.arbitrum.io/address/0x29Dd7178261d8df32dE9E4e82920d7Ae1c204cD1)
3.  [Created Retryable Ticket for Updating Greeting Message of GreeterL2 | L1 Tx](https://rinkeby.etherscan.io/tx/0x1945e2900cf5d5e512f815f485941583a455e5267e263db74e1e4a650cacb3d5)
4.  [Confirmed Tx for Updating Greeting Message of GreeterL2 | L2 Tx](https://rinkeby-explorer.arbitrum.io/tx/0xc465beb8e914de25b7838bee4c40b6cbaafbf4536896ffb6be7596991c69d3f5)
