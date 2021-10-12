# Executing Outbox Messages

The Outbox contract is responsible for receiving and executing all "outgoing" messages; i.e., messages passed from Arbitrum to Ethereum.

The most-common use-case is withdrawals (of Ether or tokens), but the Outbox handles any arbitrary contract call, as this demo illustrates.

## Transaction Links
