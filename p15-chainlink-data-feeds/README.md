# Chainlink Data Feed and Feed Registry

This project demonstrates how to get price feeds for different currencies using [Chainlink Data Feed](https://docs.chain.link/docs/using-chainlink-reference-contracts/) and [Chainlink Feed Registry](https://docs.chain.link/docs/feed-registry/). We will learn how to use both of these either in a smart contract or in a DApp.

## Steps for Data Feed

1.  Install dependencies using

```sh
yarn
```

2.  Create a `.env` in the project directory and write the following environment variables. `AGGREGATOR` environment variable is for [BTC / USD price feed on Rinkeby Network](https://docs.chain.link/docs/ethereum-addresses/#Rinkeby%20Testnet).

```
MNEMONIC = REPLACE_WITH_YOUR_MNEMONIC
RINKEBY_RPC = https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Aggregator address for BTC / USD feed on Rinkeby network.
# See for details: https://docs.chain.link/docs/ethereum-addresses/#Rinkeby%20Testnet
AGGREGATOR = 0xECe365B379E1dD183B20fc5f022230C044d51404
```

3.  Deploy the smart contract `contracts/DataFeedConsumer.sol` using the script in `scripts/deployDataFeedConsumer.ts`. Make sure you have some Rinkeby test ETH in your account you are using to deploy the contract.

```sh
npx hardhat run scripts/deployDataFeedConsumer.ts --network rinkeby
```

After deployment, save the address of the deployed `DataFeedConsumer` in `.env` file.

```
DATA_FEED_CONSUMER = 0xB674c51096a21d3E36c12F2c76Ba4b9bd306C4b9
```

4.  To get the latest `BTC / USD` price feed through the `DataFeedConsumer` smart contract, run the script in `scripts/withDataFeedSolidity.ts`.

```sh
npx hardhat run scripts/withDataFeedSolidity.ts --network rinkeby
```

5.  To get the latest `BTC / USD` price feed through `Ethers` library, run the script in `scripts/withDataFeedJavaScript.ts`. This is how you will use Chainlink Data Feed in a DApp using `Ethers`.

```sh
npx hardhat run scripts/withDataFeedJavaScript.ts --network rinkeby
```

## Steps for Feed Registry

1.  Install dependencies if you haven't already.

```sh
yarn
```

2.  In `.env` file, write the following environment variables. `FEED_REGISTRY` environment variable is for [Feed Registry on Kovan Network](https://docs.chain.link/docs/feed-registry/#contract-addresses).

```
MNEMONIC = REPLACE_WITH_YOUR_MNEMONIC
KOVAN_RPC = https://kovan.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Feed Registry contract address for Kovan network.
# See for details: https://docs.chain.link/docs/feed-registry/#contract-addresses
FEED_REGISTRY = 0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0
```

3.  Deploy the smart contract `contracts/FeedRegistryConsumer.sol` using the script in `scripts/deployFeedRegistryConsumer.ts`. Make sure you have some Kovan test ETH in your account you are using to deploy the contract.

```sh
npx hardhat run scripts/deployFeedRegistryConsumer.ts --network kovan
```

After deployment, save the address of the deployed `FeedRegistryConsumer` in `.env` file.

```
FEED_REGISTRY_CONSUMER = 0xf756e9C157c44AFdabfDfe975Ca49944c5281a1D
```

4.  To get the latest `ETH / USD` price feed through the `FeedRegistryConsumer` smart contract, run the script in `scripts/withFeedRegistrySolidity.ts`.

```sh
npx hardhat run scripts/withFeedRegistrySolidity.ts --network kovan
```

5.  To get the latest `ETH / USD` price feed through `Ethers` library, run the script in `scripts/withFeedRegistryJavaScript.ts`. This is how you will use Chainlink Feed Registry in a DApp using `Ethers`.

```sh
npx hardhat run scripts/withFeedRegistryJavaScript.ts --network kovan
```

## Deployed Contracts

1.  [EACAggregatorProxy Contract | Rinkeby](https://rinkeby.etherscan.io/address/0xECe365B379E1dD183B20fc5f022230C044d51404)
2.  [DataFeedConsumer Contract | Rinkeby](https://rinkeby.etherscan.io/address/0xB674c51096a21d3E36c12F2c76Ba4b9bd306C4b9)
3.  [FeedRegistry | Kovan](https://kovan.etherscan.io/address/0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0)
4.  [FeedRegistryConsumer Contract | Kovan](https://kovan.etherscan.io/address/0xf756e9C157c44AFdabfDfe975Ca49944c5281a1D)
