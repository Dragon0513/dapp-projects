export interface State {
  loading: boolean;
  errorMsg: string;
  view: Views;
  setView: React.Dispatch<React.SetStateAction<Views>>;
  isEthereumAvailable: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  account?: string | null;
  currentBlock: number;
}

export enum Views {
  Profile,
  NewProposal,
  AllProposals,
  Proposal,
}

export const initialState: State = {
  loading: false,
  errorMsg: "",
  view: Views.Profile,
  setView: () => {},
  isEthereumAvailable: false,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
  account: null,
  currentBlock: 0,
};
