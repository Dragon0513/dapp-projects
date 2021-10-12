# Moving ERC20 Tokens Between L1 and L2

This project demonstrates moving a token from Ethereum (Layer 1) into the Arbitrum (Layer 2) chain and vice versa using the Standard Token Gateway in Arbitrum's token bridging system.

Here, we deploy a demo token and trigger a deposit; by default, the deposit will be routed through the standard ERC20 gateway, where on initial deposit, a standard arb ERC20 contract will automatically be deployed to L2. We use our arb-ts library to initiate and verify the deposit.

Then, we use these new tokens to trigger a withdrawal back to L1.

## Deployed Contracts and Txns

1.  [Dapp Token (DAPP) | Rinkeby Etherscan](https://rinkeby.etherscan.io/token/0xcC901e58BFEf30c3634C00409B073213168b6942)
2.  [Approve Arbitrum to Spend Dapp Tokens | L1 Tx](https://rinkeby.etherscan.io/tx/0x9f9a4f37e1004ef6ae87a24f38777fa311ddd6dc50d88eba1e8ac96b364946ad)
3.  [Deposit Dapp Tokens to L2 | L2 Tx](https://rinkeby-explorer.arbitrum.io/tx/0x3d800597a31be1834326980508a2daa013db788932e852606db3555fe4e58d12)
4.  [Withdraw Dapp Tokens from Arbitrum | L2 Tx](https://rinkeby-explorer.arbitrum.io/tx/0x58be622ce7b513b00d20d7ffc0aadb0993e58617a6826ffc7dbc757aed6fd597)
