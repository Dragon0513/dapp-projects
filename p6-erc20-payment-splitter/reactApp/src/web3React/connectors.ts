import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    // 1, // Mainnet
    3, // Ropsten
    // 4, // Rinkeby
    // 5, // Goerli
    // 42, // Kovan
  ],
});

export const networkConnector = new NetworkConnector({
  urls: {
    3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  defaultChainId: 3,
});
