import Web3 from "web3";
import { createWeb3ReactRoot } from "@web3-react/core";
import { Providers } from "../types";

export const getLibrary = (provider: any) => {
  return new Web3(provider);
};

export const InjectedConnectorProvider = createWeb3ReactRoot(
  Providers.METAMASK
);

export const NetworkConnectorProvider = createWeb3ReactRoot(Providers.INFURA);
