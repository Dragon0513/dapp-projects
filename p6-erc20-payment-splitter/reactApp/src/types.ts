export interface State {
  loading: boolean;
  loadingData: boolean;
  errorMsg: string;
  view: Views;
  setView: React.Dispatch<React.SetStateAction<Views>>;
  isEthereumAvailable: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  account?: string | null;
  userShares: number;
  userDaiBalance: number;
  splitterData: {
    currentBalance: number;
    totalReceived: number;
    totalReleased: number;
  };
  shareHolders: ShareHolder[];
  get500Shares: () => Promise<void>;
  get1000Dai: () => Promise<void>;
  allowSplitter: (daiAmount: number) => Promise<void>;
  sendSplitter: (daiAmount: number) => Promise<void>;
  getMyPayment: () => Promise<void>;
}

export type ShareHolder = {
  address: string;
  shares: number;
  daiBalance: number;
  pending: number;
  received: number;
};

export enum Views {
  Profile,
  Payments,
  About,
}

export const initialState: State = {
  loading: false,
  loadingData: false,
  errorMsg: "",
  view: Views.Profile,
  setView: () => {},
  isEthereumAvailable: false,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
  account: null,
  userShares: 0,
  userDaiBalance: 0,
  splitterData: {
    currentBalance: 0,
    totalReceived: 0,
    totalReleased: 0,
  },
  shareHolders: [],
  get500Shares: async () => {},
  get1000Dai: async () => {},
  allowSplitter: async () => {},
  sendSplitter: async () => {},
  getMyPayment: async () => {},
};
