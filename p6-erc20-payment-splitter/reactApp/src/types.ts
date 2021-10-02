export enum Providers {
  METAMASK = "METAMASK",
  INFURA = "INFURA",
}

export interface InjectedState {
  loading: boolean;
  errorMsg: string;
  isEthereumAvailable: boolean;
  isChainSupported: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  account?: string | null;
  userShares: number;
  userDaiBalance: number;
  get500Shares: () => Promise<void>;
  get1000Dai: () => Promise<void>;
  allowSplitter: (daiAmount: number) => Promise<void>;
  sendSplitter: (daiAmount: number) => Promise<void>;
  getMyPayment: () => Promise<void>;
}

export enum Views {
  Profile,
  Payments,
  About,
}

export const initialInjectedState: InjectedState = {
  loading: false,
  errorMsg: "",
  isEthereumAvailable: false,
  isChainSupported: false,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
  account: null,
  userShares: 0,
  userDaiBalance: 0,
  get500Shares: async () => {},
  get1000Dai: async () => {},
  allowSplitter: async () => {},
  sendSplitter: async () => {},
  getMyPayment: async () => {},
};

export interface NetworkContextState {
  loading: boolean;
  errorMsg: string;
  isEthereumAvailable: boolean;
  isChainSupported: boolean;
  connected: boolean;
  splitterData: {
    currentBalance: number;
    totalReceived: number;
    totalReleased: number;
  };
  shareHolders: ShareHolder[];
}

export type ShareHolder = {
  address: string;
  shares: number;
  daiBalance: number;
  pending: number;
  received: number;
};

export const initialNetworkContext: NetworkContextState = {
  loading: false,
  errorMsg: "",
  isEthereumAvailable: false,
  isChainSupported: false,
  connected: false,
  splitterData: {
    currentBalance: 0,
    totalReceived: 0,
    totalReleased: 0,
  },
  shareHolders: [],
};
