import { FC, useState, createContext, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Web3 from "web3";
import { injector } from "../../components/wallet";
import { State, Views, initialState } from "../../types";

import { FakeDai } from "../../contracts/types/FakeDai";
import { SharesToken } from "../../contracts/types/SharesToken";
import { MySplitter } from "../../contracts/types/MySplitter";
import FakeDaiAbi from "../../contracts/abi/FakeDai.json";
import SharesTokenAbi from "../../contracts/abi/SharesToken.json";
import SplitterAbi from "../../contracts/abi/MySplitter.json";

// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Types of these env variables are declared in `react-app-env.d.ts`;
// so, we can have IntelliSense help us.
const FAKE_DAI_ADDRESS = process.env.REACT_APP_FAKE_DAI_ADDRESS;
const SHARES_TOKEN_ADDRESS = process.env.REACT_APP_SHARES_TOKEN_ADDRESS;
const SPLITTER_ADDRESS = process.env.REACT_APP_SPLITTER_ADDRESS;

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
  const [fakeDai, setFakeDai] = useState<FakeDai | null>(null);
  const [sharesToken, setSharesToken] = useState<SharesToken | null>(null);
  const [splitter, setSplitter] = useState<MySplitter | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);

  const isEthereumAvailable = !(error instanceof NoEthereumProviderError);
  const ConnectToMetaMaskError = new Error("Connect to MetaMask!");
  const ErrorSubscribingToNewBlocks = new Error("Error subscribing...");

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
      setFakeDai(
        new web3.eth.Contract(FakeDaiAbi as any, FAKE_DAI_ADDRESS) as any
      );
      setSharesToken(
        new web3.eth.Contract(
          SharesTokenAbi as any,
          SHARES_TOKEN_ADDRESS
        ) as any
      );
      setSplitter(
        new web3.eth.Contract(SplitterAbi as any, SPLITTER_ADDRESS) as any
      );
    });
  };

  /**
   * Sets contract objects to null.
   */
  const destroyContractObjects = () => {
    setFakeDai(null);
    setSharesToken(null);
    setSplitter(null);
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
  // const delegateVotes = async (delegatee: string) => {
  //   await errorWrapper(async () => {
  //     if (!web3 || !account) {
  //       throw ConnectToMetaMaskError;
  //     }
  //   });
  // };

  /**
   * Get public address of current user's delegatee. Equal to `None` if
   * delegatee is the zero address. Equal to `Yourself` if the user's address
   * and the delegatee's address are the same.
   */
  const getCurrentDelegatee = async () => {
    await errorWrapper(async () => {
      if (!web3 || !account) {
        throw ConnectToMetaMaskError;
      }
    });
  };

  /**
   * Gets the number of `MVTKN` tokens the user has in wallet.
   */
  const getVoteTokenBalance = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !account) {
        throw ConnectToMetaMaskError;
      }
    });
  };

  /**
   * Gets the voting power of the user.
   */
  const getVotingPower = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !account) {
        throw ConnectToMetaMaskError;
      }
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
  }, [/*voteToken,*/ account]);

  /***************************************************************************/
  /***************** Functions for Fetching all Proposal IDs *****************/
  /***************************************************************************/

  /**
   * Fetches all proposal IDs without filtering them on the basis of their
   * status.
   */
  // const getAllProposals = async () => {
  //   await errorWrapper(async () => {
  //     if (!web3) {
  //       throw ConnectToMetaMaskError;
  //     }
  //   });
  // };

  /**
   * Fetches all proposals as soon as the user connects to wallet.
   */
  // useEffect(
  //   () => {
  //     getAllProposals();
  //   },
  //   [
  //     /*governor*/
  //   ]
  // );

  /****************************************************************************/
  /****************** Functions for Proposing a New Proposal ******************/
  /****************************************************************************/

  /**
   * Funnction for a new proposer. Anyone can propose a new proposal as per our
   * current implementation of governor. Refetches all proposal IDs at the end.
   * @param newState New proposed state for `MyContract` contract state.
   * @param description Some description for the proposal.
   */
  // const proposeStateUpdate = async (
  //   newState: number,
  //   description: string = ""
  // ) => {
  //   await errorWrapper(async () => {
  //     if (!web3 || !account) {
  //       throw ConnectToMetaMaskError;
  //     }
  //   });
  // };

  /**
   * Gets the current state value from `MyContract` contract.
   */
  // const getCurrentStateOfMyContract = async () => {
  //   await errorWrapper(async () => {
  //     if (!connected || !account) {
  //       throw ConnectToMetaMaskError;
  //     }
  //   });
  // };

  /**
   * This effect updates the state of `MyContract` contract in the UI as soon as
   * the user connects to the wallet.
   */
  // useEffect(
  //   () => {
  //     getCurrentStateOfMyContract();
  //   },
  //   [
  //     /*myContract*/
  //   ]
  // );

  /***************************************************************************/
  /*********** Functions for Interacting with an Existing Proposal ***********/
  /***************************************************************************/

  /**
   * Gets status of a proposal and the status of voting on it.
   * @param id Id of the proposal.
   */
  // const getProposal = async (id: string) => {
  //   setErrorMsg("");
  //   try {
  //     if (!connected || !web3 || !account) {
  //       throw ConnectToMetaMaskError;
  //     }
  //   } catch (error) {
  //     // console.log({ error });
  //     if (typeof error === "object") {
  //       const _err = error as any;
  //       setErrorMsg(_err.message);
  //     }
  //   }
  // };

  /**
   * Casts vote for a given proposal. User must have non-zero voting power.
   * @param proposalId ID of the proposal.
   * @param support Are you voting `For` or `Against` the proposal or want to
   * `Abstain` from voting on this proposal.
   */
  // const castVote = async (proposalId: string, support: VoteType) => {
  //   await errorWrapper(async () => {
  //     if (!connected || !account || !web3) {
  //       throw ConnectToMetaMaskError;
  //     }
  //   });
  // };

  /**
   * Cancels the given proposal. User must be the proposer of the proposal.
   * @param id ID of the proposal.
   */
  // const cancelProposal = async (id: string) => {
  //   await errorWrapper(async () => {
  //     if (!connected || !account || !web3) {
  //       throw ConnectToMetaMaskError;
  //     }
  //     await web3.eth.sendTransaction({
  //       from: account,
  //     });
  //   });
  // };

  /**
   * Puts a given proposal in the timelock queue. Proposal must be in
   * `Succeeded` state.
   * @param proposalId ID of the proposal.
   */
  // const queueProposal = async (proposalId: string) => {
  //   await errorWrapper(async () => {
  //     if (!connected || !account || !web3) {
  //       throw ConnectToMetaMaskError;
  //     }
  //     await web3.eth.sendTransaction({
  //       from: account,
  //     });
  //   });
  // };

  /**
   * Executes a given proposal. The proposal must be in `Queued` state and
   * timelock delay must have passed.
   * @param proposalId ID of the proposal.
   */
  // const executeProposal = async (proposalId: string) => {
  //   await errorWrapper(async () => {
  //     if (!connected || !account || !web3) {
  //       throw ConnectToMetaMaskError;
  //     }
  //     await web3.eth.sendTransaction({
  //       from: account,
  //     });
  //   });
  // };

  /**
   * Fetches proposal data as soon as a proposal is selected from the list of
   * all proposals or a new block is added in the Ropsten Testnet.
   */
  useEffect(() => {
    // getProposal(currentProposalId);
  }, [/*currentProposalId,*/ currentBlock]);

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
    currentBlock,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
