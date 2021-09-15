/// <reference types="react-scripts" />

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_MY_TOKEN_CONTRACT: string;
      REACT_APP_MY_DEX_CONTRACT: string;
    }
  }
}

export interface State {
  loading: boolean;
  errorMsg: string;
  isEthereumAvailable: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  account?: string | null;
  ethBalanceOfUser: number;
  myTokenBalanceOfUser: number;
  ethBalanceOfDex: number;
  myTokenBalanceOfDex: number;
  dexAllowance: number;
  allowDex: (tokensToAllow: number) => Promise<void>;
  buyMyTokens: (tokensToBuy: number) => Promise<void>;
  sellMyTokens: (tokensToSell: number) => Promise<void>;
}
