import { FC, useState, createContext, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Web3 from "web3";
import { injector } from "../../components/wallet";
import { State, VoteType, Views, initialProposal } from "../../types";

import { MyContract } from "../../contracts/types/MyContract";
import { MyVoteToken } from "../../contracts/types/MyVoteToken";
import { MyGovernor } from "../../contracts/types/MyGovernor";
import MyContractAbi from "../../contracts/abi/MyContract.json";
import MyVoteTokenAbi from "../../contracts/abi/MyVoteToken.json";
import MyGovernorAbi from "../../contracts/abi/MyGovernor.json";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Types of these env variables are declared in `react-app-env.d.ts`;
// so, we can have IntelliSense help us.
const MY_CONTRACT_ADDRESS = process.env.REACT_APP_MY_CONTRACT_ADDRESS;
const MY_VOTE_TOKEN_ADDRESS = process.env.REACT_APP_MY_VOTE_TOKEN_ADDRESS;
const MY_GOVERNOR_ADDRESS = process.env.REACT_APP_MY_GOVERNOR_ADDRESS;

const initialState: State = {
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

const AppContext = createContext<State>(initialState);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: FC = ({ children }) => {
  const {
    activate,
    active: connected,
    deactivate,
    account,
    error,
    library: web3,
  } = useWeb3React<Web3>();
  const [loading, setLoading] = useState(initialState.loading);
  const [errorMsg, setErrorMsg] = useState(initialState.errorMsg);
  const [view, setView] = useState<Views>(Views.Profile);
  const [currentProposalId, setCurrentProposalId] = useState("");
  const [currentProposal, setCurrentProposal] = useState(initialProposal);
  const isEthereumAvailable = !(error instanceof NoEthereumProviderError);
  const [myContract, setMyContract] = useState<MyContract | null>(null);
  const [voteToken, setVoteToken] = useState<MyVoteToken | null>(null);
  const [governor, setGovernor] = useState<MyGovernor | null>(null);
  const [voteTokenBalanceOfUser, setVoteTokenBalanceOfUser] = useState(0);
  const [votingPowerOfUser, setVotingPowerOfUser] = useState(0);
  const [currentDelegatee, setCurrentDelegatee] = useState(
    initialState.currentDelegatee
  );
  const [proposalIds, setProposalIds] = useState<string[]>([]);
  const [currentStateOfMyContract, setCurrentState] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const ConnectToMetaMaskError = new Error("Connect to MetaMask!");
  // const ErrorUpdatingOnSubscribedValue = new Error(
  //   "Error updating on subscribed value."
  // );

  const resetError = () => {
    setErrorMsg("");
  };

  /**
   * An error handling wrapper for functions to avoid code duplication.
   */
  const errorWrapper = async (fn: () => void) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await fn();
    } catch (error) {
      // console.log({ error });
      if (typeof error === "object") {
        const _err = error as any;
        setErrorMsg(_err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createContractObjects = () => {
    errorWrapper(() => {
      if (!connected || !web3) {
        destroyContractObjects();
        throw ConnectToMetaMaskError;
      }
      setMyContract(
        new web3.eth.Contract(MyContractAbi as any, MY_CONTRACT_ADDRESS) as any
      );
      setVoteToken(
        new web3.eth.Contract(
          MyVoteTokenAbi as any,
          MY_VOTE_TOKEN_ADDRESS
        ) as any
      );
      setGovernor(
        new web3.eth.Contract(MyGovernorAbi as any, MY_GOVERNOR_ADDRESS) as any
      );
    });
  };

  const destroyContractObjects = () => {
    setMyContract(null);
    setVoteToken(null);
    setGovernor(null);
  };

  useEffect(() => {
    createContractObjects();
  }, [web3]);

  /**
   * Connect to MetaMask wallet.
   */
  const connect = async () => {
    await errorWrapper(async () => {
      await activate(injector);
      resetError();
    });
  };

  /**
   * Disconnect from MetaMask wallet.
   */
  const disconnect = () => {
    errorWrapper(() => {
      deactivate();
      resetError();
    });
  };

  /******************* Profile *******************/

  /**
   * Delegates user's votes to the given address.
   * @param delegatee Public address of the delegatee.
   */
  const delegateVotes = async (delegatee: string) => {
    await errorWrapper(async () => {
      if (!web3 || !account || !voteToken) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: MY_VOTE_TOKEN_ADDRESS,
        data: voteToken.methods.delegate(delegatee).encodeABI(),
      });
    });
  };

  /**
   * Get public address of current user's delegatee. Equal to `None` if
   * delegatee is the zero address. Equal to `Yourself` if the user's address
   * and the delegatee's address are the same.
   */
  const getCurrentDelegatee = async () => {
    await errorWrapper(async () => {
      if (!web3 || !account || !voteToken) {
        throw ConnectToMetaMaskError;
      }
      const delegatee = await voteToken.methods.delegates(account).call();
      if (delegatee === account) {
        setCurrentDelegatee("Yourself");
      } else if (delegatee === ZERO_ADDRESS) {
        setCurrentDelegatee("None");
      } else {
        setCurrentDelegatee(delegatee);
      }
    });
  };

  const getVoteTokenBalance = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !voteToken || !account) {
        setVoteTokenBalanceOfUser(0);
        throw ConnectToMetaMaskError;
      }
      let b = await voteToken.methods.balanceOf(account).call();
      b = web3.utils.fromWei(b, "ether");
      setVoteTokenBalanceOfUser(+b);
    });
  };

  const getVotingPower = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !voteToken || !account) {
        setVotingPowerOfUser(0);
        throw ConnectToMetaMaskError;
      }
      let b = await voteToken.methods.getVotes(account).call();
      b = web3.utils.fromWei(b, "ether");
      setVotingPowerOfUser(+b);
    });
  };

  useEffect(() => {
    getVoteTokenBalance();
    getVotingPower();
    getCurrentDelegatee();
  }, [voteToken, account]);

  /******************* New Proposal *******************/

  const proposeStateUpdate = async (
    newState: number,
    description: string = ""
  ) => {
    await errorWrapper(async () => {
      if (!web3 || !account || !governor || !myContract) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: MY_GOVERNOR_ADDRESS,
        data: governor.methods["propose(address[],uint256[],bytes[],string)"](
          [MY_CONTRACT_ADDRESS],
          [0],
          [myContract.methods.updateState(newState).encodeABI()],
          description
        ).encodeABI(),
      });
      await getAllProposals();
    });
  };

  const getCurrentStateOfMyContract = async () => {
    await errorWrapper(async () => {
      if (!connected || !account || !myContract) {
        throw ConnectToMetaMaskError;
      }
      const currentState = await myContract.methods.getCurrentState().call();
      setCurrentState(+currentState);
    });
  };

  useEffect(() => {
    getCurrentStateOfMyContract();
  }, [myContract]);

  /******************* All Proposals *******************/

  const getAllProposals = async () => {
    await errorWrapper(async () => {
      if (!web3 || !governor) {
        throw ConnectToMetaMaskError;
      }
      let ids = await governor.methods.getAllProposalIds().call();
      ids = ids.map(id => web3.utils.numberToHex(id));
      setProposalIds(ids);
    });
  };

  useEffect(() => {
    getAllProposals();
  }, [governor]);

  /******************* Proposal *******************/

  const getProposal = async (id: string) => {
    setErrorMsg("");
    try {
      if (!connected || !web3 || !account || !governor || !myContract) {
        throw ConnectToMetaMaskError;
      }
      const status = await governor.methods.state(id).call();
      const result = await governor.methods.proposals(id).call();
      const quorumVotes = await governor.methods.quorumVotes().call();
      const hasVoted = await governor.methods.hasVoted(id, account).call();
      const eta = +result.eta - Math.round(Date.now() / 1000);
      const timelockDelay = eta <= 0 ? 0 : eta;
      setCurrentProposal({
        id: result.id,
        proposer: result.proposer,
        status: +status,
        quorumVotes: web3.utils.fromWei(quorumVotes, "ether"),
        startsIn: result.startBlock,
        endsIn: result.endBlock,
        timelockDelay,
        forVotes: web3.utils.fromWei(result.forVotes, "ether"),
        againstVotes: web3.utils.fromWei(result.againstVotes, "ether"),
        abstainVotes: web3.utils.fromWei(result.abstainVotes, "ether"),
        hasVoted,
      });
    } catch (error) {
      // console.log({ error });
      if (typeof error === "object") {
        const _err = error as any;
        setErrorMsg(_err.message);
      }
    }
  };

  const castVote = async (proposalId: string, support: VoteType) => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !governor) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: MY_GOVERNOR_ADDRESS,
        data: governor.methods.castVote(proposalId, support).encodeABI(),
      });
      await getProposal(currentProposalId);
    });
  };

  const cancelProposal = async (id: string) => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !governor) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: MY_GOVERNOR_ADDRESS,
        data: governor.methods.cancel(id).encodeABI(),
      });
    });
  };

  const queueProposal = async (proposalId: string) => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !governor) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: MY_GOVERNOR_ADDRESS,
        data: governor.methods["queue(uint256)"](proposalId).encodeABI(),
      });
    });
  };

  const executeProposal = async (proposalId: string) => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !governor) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: MY_GOVERNOR_ADDRESS,
        data: governor.methods["execute(uint256)"](proposalId).encodeABI(),
      });
      await getCurrentStateOfMyContract();
    });
  };

  useEffect(() => {
    getProposal(currentProposalId);
  }, [currentProposalId, currentBlock]);

  const subscribe = () => {
    if (!connected || !web3) {
      return;
    }
    web3.eth.subscribe("newBlockHeaders", (err, block) => {
      console.log({ blockNumber: block.number });
      setCurrentBlock(block.number);
    });
  };

  useEffect(() => {
    subscribe();
  }, [web3]);

  const value: State = {
    // ...initialState,
    loading,
    errorMsg,
    view,
    setView,
    isEthereumAvailable,
    connected,
    connect,
    disconnect,
    account,
    voteTokenBalanceOfUser,
    votingPowerOfUser,
    delegateVotes,
    currentDelegatee,
    proposalIds,
    currentProposalId,
    setCurrentProposalId,
    currentProposal,
    currentStateOfMyContract,
    currentBlock,
    proposeStateUpdate,
    getProposal,
    castVote,
    cancelProposal,
    queueProposal,
    executeProposal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
