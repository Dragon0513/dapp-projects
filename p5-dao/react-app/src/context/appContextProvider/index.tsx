import { FC, useState, createContext, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Web3 from "web3";
import { injector } from "../../components/wallet";
import {
  State,
  VoteType,
  Views,
  initialProposal,
  initialState,
} from "../../types";

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
  const ErrorSubscribingToNewBlocks = new Error(
    "Error subscribing to new blocks."
  );

  /***************************************************************************/
  /**************************** Utility Functions ****************************/
  /***************************************************************************/

  /**
   * Resets error message state variable to an empty string.
   */
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

  /**
   * Creates contract objects for `MyVoteToken`, `MyGovernor` and `MyContract`
   * contracts.
   */
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

  /**
   * Sets contract objects to null.
   */
  const destroyContractObjects = () => {
    setMyContract(null);
    setVoteToken(null);
    setGovernor(null);
  };

  /**
   * Creates contract objects as soon as the user connects to MetaMask.
   */
  useEffect(() => {
    createContractObjects();
  }, [web3]);

  /****************************************************************************/
  /******************* Functions for Connecting with Wallet *******************/
  /****************************************************************************/

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

  /****************************************************************************/
  /************************ Functions for User Profile ************************/
  /****************************************************************************/

  /**
   * Delegates user's votes to the given address. So that the delegatee can vote
   * on your behalf. It will increase the delegatee's voting power.
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

  /**
   * Gets the number of `MVTKN` tokens the user has in wallet.
   */
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

  /**
   * Gets the voting power of the user.
   */
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

  /**
   * This effect updates current user's `MVTKN` token balance, voting power and
   * his/her delegatee. Besides the first render, this effect runs as soon as
   * the user connects to MetaMask or changes account in his/her MetaMask
   * wallet.
   */
  useEffect(() => {
    getVoteTokenBalance();
    getVotingPower();
    getCurrentDelegatee();
  }, [voteToken, account]);

  /***************************************************************************/
  /***************** Functions for Fetching all Proposal IDs *****************/
  /***************************************************************************/

  /**
   * Fetches all proposal IDs without filtering them on the basis of their
   * status.
   */
  const getAllProposals = async () => {
    await errorWrapper(async () => {
      if (!web3 || !governor) {
        setProposalIds([]);
        throw ConnectToMetaMaskError;
      }
      let ids = await governor.methods.getAllProposalIds().call();
      ids = ids.map(id => web3.utils.numberToHex(id));
      setProposalIds(ids);
    });
  };

  /**
   * Fetches all proposals as soon as the user connects to wallet.
   */
  useEffect(() => {
    getAllProposals();
  }, [governor]);

  /****************************************************************************/
  /****************** Functions for Proposing a New Proposal ******************/
  /****************************************************************************/

  /**
   * Funnction for a new proposer. Anyone can propose a new proposal as per our
   * current implementation of governor. Refetches all proposal IDs at the end.
   * @param newState New proposed state for `MyContract` contract state.
   * @param description Some description for the proposal.
   */
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

  /**
   * Gets the current state value from `MyContract` contract.
   */
  const getCurrentStateOfMyContract = async () => {
    await errorWrapper(async () => {
      if (!connected || !account || !myContract) {
        throw ConnectToMetaMaskError;
      }
      const currentState = await myContract.methods.getCurrentState().call();
      setCurrentState(+currentState);
    });
  };

  /**
   * This effect updates the state of `MyContract` contract in the UI as soon as
   * the user connects to the wallet.
   */
  useEffect(() => {
    getCurrentStateOfMyContract();
  }, [myContract]);

  /***************************************************************************/
  /*********** Functions for Interacting with an Existing Proposal ***********/
  /***************************************************************************/

  /**
   * Gets status of a proposal and the status of voting on it.
   * @param id Id of the proposal.
   */
  const getProposal = async (id: string) => {
    setErrorMsg("");
    try {
      if (!connected || !web3 || !account || !governor) {
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

  /**
   * Casts vote for a given proposal. User must have non-zero voting power.
   * @param proposalId ID of the proposal.
   * @param support Are you voting `For` or `Against` the proposal or want to
   * `Abstain` from voting on this proposal.
   */
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

  /**
   * Cancels the given proposal. User must be the proposer of the proposal.
   * @param id ID of the proposal.
   */
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

  /**
   * Puts a given proposal in the timelock queue. Proposal must be in
   * `Succeeded` state.
   * @param proposalId ID of the proposal.
   */
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

  /**
   * Executes a given proposal. The proposal must be in `Queued` state and
   * timelock delay must have passed.
   * @param proposalId ID of the proposal.
   */
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

  /**
   * Fetches proposal data as soon as a proposal is selected from the list of
   * all proposals or a new block is added in the Ropsten Testnet.
   */
  useEffect(() => {
    getProposal(currentProposalId);
  }, [currentProposalId, currentBlock]);

  /***************************************************************************/
  /******************* Functions for Subscribing to Events *******************/
  /***************************************************************************/

  /**
   * Updates `currentBlock` state variable value as soon as a new block is
   * added to the chain.
   */
  const subscribe = () => {
    errorWrapper(() => {
      if (!connected || !web3) {
        throw ErrorSubscribingToNewBlocks;
      }
      web3.eth.subscribe("newBlockHeaders", (err, block) => {
        console.log({ blockNumber: block.number });
        setCurrentBlock(block.number);
      });
    });
  };

  /**
   * Subscribes as soon as the user connects to MetaMask.
   */
  useEffect(() => {
    subscribe();
  }, [web3]);

  const value: State = {
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
