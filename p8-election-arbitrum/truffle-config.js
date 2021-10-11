require("dotenv").config({ path: "./.env" });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const wrapProvider = require("arb-ethers-web3-bridge").wrapProvider;
const MNEMONIC = process.env.MNEMONIC;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const GANACHE_MNEMONIC = process.env.GANACHE_MNEMONIC;

module.exports = {
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.9",
      // docker: true, // Use compiler you've installed locally with docker (default: false)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./build/contracts/",
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Any network (default: none)
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`
        ),
      network_id: 3,
      gas: 5500000,
      gasPrice: 10e9,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`
        ),
      network_id: 4,
      gasPrice: 10e9,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`
        ),
      network_id: 5,
      gasPrice: 10e9,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`
        ),
      network_id: 42,
      gasPrice: 10e9,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    // arbitrum_mainnet: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       MNEMONIC,
    //       `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
    //     ),
    //   network_id: 42161,
    //   gasPrice: 10e9,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    // },
    arbitrum_rinkeby: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, "https://rinkeby.arbitrum.io/rpc"),
      network_id: 421611,
      gasPrice: 10e9,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000000,
    },
    arbitrum_local: {
      provider: () => {
        return wrapProvider(
          new HDWalletProvider(GANACHE_MNEMONIC, "http://127.0.0.1:8545")
        );
      },
      network_id: "*",
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
};
