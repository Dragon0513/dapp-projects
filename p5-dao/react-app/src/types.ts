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
  voteTokenBalanceOfUser: number;
  votingPowerOfUser: number;
  delegateVotes: (delegatee: string) => Promise<void>;
  currentDelegatee: string | null;
  proposalIds: string[];
  currentProposalId: string;
  setCurrentProposalId: React.Dispatch<React.SetStateAction<string>>;
  currentProposal: Proposal;
  currentStateOfMyContract: number;
  currentBlock: number;
  proposeStateUpdate: (newState: number, description: string) => Promise<void>;
  getProposal: (id: string) => Promise<void>;
  castVote: (proposalId: string, support: VoteType) => Promise<void>;
  cancelProposal: (id: string) => Promise<void>;
  queueProposal: (proposalId: string) => Promise<void>;
  executeProposal: (proposalId: string) => Promise<void>;
}

type Proposal = {
  id: string;
  proposer: string;
  status: ProposalStatus;
  quorumVotes: string;
  startsIn: string;
  endsIn: string;
  timelockDelay: number;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  hasVoted: boolean;
};

export enum ProposalStatus {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export enum VoteType {
  Against,
  For,
  Abstain,
}

export enum Views {
  Profile,
  NewProposal,
  AllProposals,
  Proposal,
}

export const initialProposal: Proposal = {
  id: "",
  proposer: "0x00000",
  status: ProposalStatus.Executed,
  quorumVotes: "0",
  startsIn: "0",
  endsIn: "0",
  timelockDelay: 0,
  forVotes: "0",
  againstVotes: "0",
  abstainVotes: "0",
  hasVoted: true,
};

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
  voteTokenBalanceOfUser: 0,
  votingPowerOfUser: 0,
  delegateVotes: async () => {},
  currentDelegatee: null,
  proposalIds: [],
  currentProposalId: "",
  setCurrentProposalId: () => {},
  currentProposal: initialProposal,
  currentStateOfMyContract: 0,
  currentBlock: 0,
  proposeStateUpdate: async () => {},
  getProposal: async () => {},
  castVote: async () => {},
  cancelProposal: async () => {},
  queueProposal: async () => {},
  executeProposal: async () => {},
};
