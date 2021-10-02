import { FC, useState, createContext, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { injectedConnector } from "../../web3React/connectors";
import {
  Providers,
  NetworkContextState,
  initialNetworkContext,
  ShareHolder,
} from "../../types";

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

const NetworkContext = createContext<NetworkContextState>(
  initialNetworkContext
);
export const useNetworkContext = () => useContext(NetworkContext);

export const NetworkContextProvider: FC = ({ children }) => {
  const {
    activate,
    active: connected,
    error,
    library: web3,
  } = useWeb3React<Web3>(Providers.INFURA);
  const [loading, setLoading] = useState(initialNetworkContext.loading);
  const [errorMsg, setErrorMsg] = useState(initialNetworkContext.errorMsg);
  const [fakeDai, setFakeDai] = useState<FakeDai | null>(null);
  const [sharesToken, setSharesToken] = useState<SharesToken | null>(null);
  const [splitter, setSplitter] = useState<MySplitter | null>(null);

  const [splitterData, setSplitterData] = useState(
    initialNetworkContext.splitterData
  );
  const [shareHolders, setShareHolders] = useState(
    initialNetworkContext.shareHolders
  );

  const isEthereumAvailable = !(error instanceof NoEthereumProviderError);
  const isChainSupported = !(error instanceof UnsupportedChainIdError);
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
   * Connect to Infura node.
   */
  const connect = async () => {
    await errorWrapper(async () => {
      await activate(injectedConnector);
      resetError();
    });
  };

  /**
   * Creates contract objects for `fakeDai`, `sharesToken` and `splitter`
   * contracts.
   */
  const createContractObjects = () => {
    errorWrapper(() => {
      if (!connected || !web3) {
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
   * Connect to Infura RPC when the app loads.
   */
  useEffect(() => {
    connect();
  }, []);

  /**
   * Creates contract objects as soon as the user connects to MetaMask.
   */
  useEffect(() => {
    createContractObjects();
  }, [web3]);

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
    await errorWrapper(async () => {
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
    });
  };

  /***************************************************************************/
  /****************************** Subscriptions ******************************/
  /***************************************************************************/

  const updateBalances = async (err: Error) => {
    if (!err) {
      getAllShareHoldersData();
      getSplitterBalances();
    }
  };

  const subscribe = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !sharesToken || !fakeDai) {
        throw ConnectToMetaMaskError;
      }
      sharesToken.events.SharesChanged(updateBalances);
      fakeDai.events.Transfer(updateBalances);
    });
  };

  useEffect(() => {
    subscribe();
    if (web3) {
      return web3.eth.clearSubscriptions(() => {});
    }
  }, [web3, sharesToken]);

  /**
   * It is called when the user connects to the wallet.
   */
  useEffect(() => {
    getAllShareHoldersData();
    getSplitterBalances();
  }, [splitter, fakeDai, sharesToken]);

  const value: NetworkContextState = {
    loading,
    errorMsg,
    isEthereumAvailable,
    isChainSupported,
    connected,
    shareHolders,
    splitterData,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
