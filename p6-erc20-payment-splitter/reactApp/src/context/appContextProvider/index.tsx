import { FC, useState, createContext, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Web3 from "web3";
import { injector } from "../../components/wallet";
import { State, Views, initialState, ShareHolder } from "../../types";

import { FakeDai } from "../../contracts/types/FakeDai";
import { SharesToken } from "../../contracts/types/SharesToken";
import { MySplitter } from "../../contracts/types/MySplitter";
import FakeDaiAbi from "../../contracts/abi/FakeDai.json";
import SharesTokenAbi from "../../contracts/abi/SharesToken.json";
import SplitterAbi from "../../contracts/abi/MySplitter.json";

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
  const [loadingData, setLoadingData] = useState(initialState.loading);
  const [errorMsg, setErrorMsg] = useState(initialState.errorMsg);
  const [view, setView] = useState<Views>(Views.Profile);
  const [fakeDai, setFakeDai] = useState<FakeDai | null>(null);
  const [sharesToken, setSharesToken] = useState<SharesToken | null>(null);
  const [splitter, setSplitter] = useState<MySplitter | null>(null);

  const [userShares, setUserShares] = useState(initialState.userShares);
  const [userDaiBalance, setUserDaiBalance] = useState(
    initialState.userDaiBalance
  );
  const [shareHolders, setShareHolders] = useState(initialState.shareHolders);
  const [splitterData, setSplitterData] = useState(initialState.splitterData);

  const isEthereumAvailable = !(error instanceof NoEthereumProviderError);
  const ConnectToMetaMaskError = new Error("Connect to MetaMask!");

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
      console.log({ error });
      if (typeof error === "object") {
        const _err = error as any;
        setErrorMsg(_err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates contract objects for `fakeDai`, `sharesToken` and `splitter`
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
   * Get user's shares and fake DAI balance.
   */
  const getUserBalances = async () => {
    await errorWrapper(async () => {
      if (!web3 || !account || !sharesToken || !fakeDai) {
        setUserShares(0);
        setUserDaiBalance(0);
        throw ConnectToMetaMaskError;
      }
      let shares = await sharesToken.methods.getShares(account).call();
      shares = web3.utils.fromWei(shares, "ether");
      setUserShares(+shares);

      let daiBalance = await fakeDai.methods.balanceOf(account).call();
      daiBalance = web3.utils.fromWei(daiBalance, "ether");
      setUserDaiBalance(+daiBalance);
    });
  };

  /**
   * Update user's shares and fake DAI balance whenever user connects to the
   * wallet or changes account from the wallet.
   */
  useEffect(() => {
    getUserBalances();
  }, [sharesToken, fakeDai, account]);

  /**
   * Mint and get 500 Shares Tokens.
   */
  const get500Shares = async () => {
    await errorWrapper(async () => {
      if (!web3 || !account || !sharesToken) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: SHARES_TOKEN_ADDRESS,
        data: sharesToken.methods.sendMe500Shares().encodeABI(),
      });
      await Promise.all([getUserBalances(), getAllShareHoldersData()]);
    });
  };

  /**
   * Mint and get 1000 fake DAIs so they can be sent to the payment splitter.
   */
  const get1000Dai = async () => {
    await errorWrapper(async () => {
      if (!web3 || !account || !fakeDai) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: FAKE_DAI_ADDRESS,
        data: fakeDai.methods.sendMe1000Dai().encodeABI(),
      });
      await getUserBalances();
    });
  };

  /****************************************************************************/
  /***************** Functions for Fetching all Share Holders *****************/
  /****************************************************************************/

  /**
   * Get the amount of fake DAIs the payment splitter currently has, the amount
   * it has received so far and the amount it has released so far.
   */
  const getSplitterBalances = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !fakeDai || !splitter) {
        setSplitterData({
          currentBalance: 0,
          totalReceived: 0,
          totalReleased: 0,
        });
        throw ConnectToMetaMaskError;
      }
      const currentBalance = await fakeDai.methods
        .balanceOf(SPLITTER_ADDRESS)
        .call();
      const totalReceived = await splitter.methods.totalReceived().call();
      const totalReleased = await splitter.methods.totalPaid().call();

      setSplitterData({
        currentBalance: +web3.utils.fromWei(currentBalance, "ether"),
        totalReceived: +web3.utils.fromWei(totalReceived, "ether"),
        totalReleased: +web3.utils.fromWei(totalReleased, "ether"),
      });
    });
  };

  /**
   * Get all the share holders and stats about them.
   */
  const getAllShareHoldersData = async () => {
    setLoadingData(true);
    setErrorMsg("");
    try {
      if (!connected || !web3 || !sharesToken || !fakeDai || !splitter) {
        throw ConnectToMetaMaskError;
      }
      const addresses = await sharesToken.methods.getHolders().call();

      let shareHoldersData: ShareHolder[] = [];
      addresses.forEach(async address => {
        const [shares, daiBalance, pending, received] = await Promise.all([
          sharesToken.methods.getShares(address).call(),
          fakeDai.methods.balanceOf(address).call(),
          splitter.methods.paymentPending(address).call(),
          splitter.methods.totalPaidTo(address).call(),
        ]);

        shareHoldersData.push({
          address,
          shares: +web3.utils.fromWei(shares, "ether"),
          daiBalance: +web3.utils.fromWei(daiBalance, "ether"),
          pending: +web3.utils.fromWei(pending, "ether"),
          received: +web3.utils.fromWei(received, "ether"),
        });
      });

      setShareHolders(shareHoldersData);
    } catch (error) {
      console.log({ error });
      if (typeof error === "object") {
        const _err = error as any;
        setErrorMsg(_err.message);
      }
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * It is called when the user connects to the wallet.
   */
  useEffect(() => {
    getAllShareHoldersData();
    getSplitterBalances();
  }, [splitter]);

  /****************************************************************************/
  /****************** Functions for Proposing a New Proposal ******************/
  /****************************************************************************/

  /**
   * Allow payment splitter to get `daiAmount` fake DAIs from user's account.
   * @param daiAmount Amount of fake DAIs to allow.
   */
  const allowSplitter = async (daiAmount: number) => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !fakeDai) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: FAKE_DAI_ADDRESS,
        data: fakeDai.methods
          .approve(
            SPLITTER_ADDRESS,
            web3.utils.toWei(daiAmount.toString(), "ether")
          )
          .encodeABI(),
      });
    });
  };

  /**
   * Send `daiAmount` fake DAIs to the payment splitter.
   * @param daiAmount Amount of fake DAIs to send.
   */
  const sendSplitter = async (daiAmount: number) => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !splitter) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: SPLITTER_ADDRESS,
        data: splitter.methods
          .receivePayment(
            account,
            web3.utils.toWei(daiAmount.toString(), "ether")
          )
          .encodeABI(),
      });
      await Promise.all([
        getUserBalances(),
        getSplitterBalances(),
        getAllShareHoldersData(),
      ]);
    });
  };

  /**
   * Get current user's pending payment from the payment splitter.
   */
  const getMyPayment = async () => {
    await errorWrapper(async () => {
      if (!connected || !account || !web3 || !splitter) {
        throw ConnectToMetaMaskError;
      }
      await web3.eth.sendTransaction({
        from: account,
        to: SPLITTER_ADDRESS,
        data: splitter.methods.releasePayment().encodeABI(),
      });
      await Promise.all([
        getUserBalances(),
        getSplitterBalances(),
        getAllShareHoldersData(),
      ]);
    });
  };

  const value: State = {
    loading,
    loadingData,
    errorMsg,
    view,
    setView,
    isEthereumAvailable,
    connected,
    connect,
    disconnect,
    account,
    userShares,
    userDaiBalance,
    shareHolders,
    splitterData,
    get500Shares,
    get1000Dai,
    allowSplitter,
    sendSplitter,
    getMyPayment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
