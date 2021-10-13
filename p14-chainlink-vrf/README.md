# Chainlink VRF

This project demonstrates how to get a verifiable random number using [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf/) as a tamper-proof random number generator (RNG). This random number can be used in any application which rely on unpredictable outcomes:

- Blockchain games and NFTs
- Random assignment of duties and resources (e.g. randomly assigning judges to cases)
- Choosing a representative sample for consensus mechanisms

## Steps

1.  Install dependencies using

```sh
yarn
```

2.  Create a `.env` in the project directory and write the following environment variables:

```
MNEMONIC = REPLACE_WITH_YOUR_MNEMONIC
RINKEBY_RPC = https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

3.  Deploy the smart contract `contracts/MyRNG.sol` using the script in `scripts/deployMyRNG.ts`. Make sure you have some Rinkeby test ETH in your account you are using to deploy the contract.

```sh
npx hardhat run scripts/deployMyRNG.ts --network rinkeby
```

4.  Request a random number from Chainlink VRF using the script given in `scripts/getNewRandomNumber.ts`.

```sh
npx hardhat run scripts/getNewRandomNumber.ts --network rinkeby
```

5.  Check for the random value by running the script in `scripts/getCurrentNumber.ts`. It may take some time for the new random value to appear. So, you may need to run this script multiple times until the new random value appears.

```sh
npx hardhat run scripts/getCurrentNumber.ts --network rinkeby
```

## Deployed Contracts and Txns

1.  [VRFCoordinator Address | Rinkeby](https://rinkeby.etherscan.io/address/0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B)
2.  [LinkToken Address | Rinkeby](https://rinkeby.etherscan.io/address/0x01BE23585060835E02B77ef475b0Cc51aA1e0709)
3.  [MyRNG Contract | Rinkeby](https://rinkeby.etherscan.io/address/0x3C3E8d8724fDf5b228A07A8B4aF8aDC5484c2F0a)
4.  [Txn For Requesting Random Number | Rinkeby](https://rinkeby.etherscan.io/tx/0x9e54abffd16f2705e42b50d32d08fa7005ca11538e90d9047d1e45c2cd46337a)
5.  [Randomness Fullfillment Txn | Rinkeby](https://rinkeby.etherscan.io/tx/0x32bfb0ba7aaf648c3943131aa32d55becaf6d42d86c3840439af4ee9e6ba9485)
