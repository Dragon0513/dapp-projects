import { FC, useState, createContext, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Web3 from "web3";
import { injector } from "../../components/wallet";
import { MyToken } from "../../contracts/types/MyToken";
import { MyDex } from "../../contracts/types/MyDex";
import MyTokenAbi from "../../contracts/abi/MyToken.json";
import MyDexAbi from "../../contracts/abi/MyDex.json";
import { State } from "../../react-app-env";

// Types of these env variables are declared in `react-app-env.d.ts`;
// so, we can have IntelliSense help us.
const MY_TOKEN_ADDRESS = process.env.REACT_APP_MY_TOKEN_CONTRACT;
const MY_DEX_ADDRESS = process.env.REACT_APP_MY_DEX_CONTRACT;

const initialState: State = {
  loading: false,
  errorMsg: "",
  isEthereumAvailable: false,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
  account: null,
  ethBalanceOfUser: 0,
  myTokenBalanceOfUser: 0,
  ethBalanceOfDex: 0,
  myTokenBalanceOfDex: 0,
  dexAllowance: 0,
  allowDex: async (_: number) => {},
  buyMyTokens: async (_: number) => {},
  sellMyTokens: async (_: number) => {},
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
  const [errorMsg, setErrorMsg] = useState(initialState.errorMsg);
  const [loading, setLoading] = useState(initialState.loading);
  const isEthereumAvailable = !(error instanceof NoEthereumProviderError);
  const [myToken, setMyToken] = useState<MyToken | null>(null);
  const [myDex, setMyDex] = useState<MyDex | null>(null);
  const [ethBalanceOfUser, setEthBalanceOfUser] = useState(0);
  const [myTokenBalanceOfUser, setMyTokenBalanceOfUser] = useState(0);
  const [ethBalanceOfDex, setEthBalanceOfDex] = useState(0);
  const [myTokenBalanceOfDex, setMyTokenBalanceOfDex] = useState(0);
  const [dexAllowance, setDexAllowance] = useState(0);
  const ConnectToMetaMaskError = new Error("Connect to MetaMask!");
  const ErrorUpdatingOnSubscribedValue = new Error(
    "Error updating on subscribed value."
  );

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
      setErrorMsg("");
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
   * Sets `myToken` and `myDex` state values to `MyToken` and `MyDex` contract
   * objects using `web3` when the user connects to wallet. Sets `myToken` and
   * `myDex` to `null` otherwise.
   */
  const createTokenContractObjects = () => {
    errorWrapper(() => {
      if (!connected || !web3) {
        destroyTokenContractObjects();
        throw ConnectToMetaMaskError;
      }
      setMyToken(
        new web3.eth.Contract(MyTokenAbi as any, MY_TOKEN_ADDRESS) as any
      );
      setMyDex(new web3.eth.Contract(MyDexAbi as any, MY_DEX_ADDRESS) as any);
    });
  };

  /**
   * Sets `myToken` and `myDex` state values to `null`.
   */
  const destroyTokenContractObjects = () => {
    setMyToken(null);
    setMyDex(null);
  };

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

  /**
   * Approve `MyDex` contract to spend `tokensToAllow` number of `MTKN` from
   * current user's account.
   * @param tokensToAllow Number of `MTKN` to approve.
   */
  const allowDex = async (tokensToAllow: number) => {
    await errorWrapper(async () => {
      if (!web3 || !account || !myToken) {
        console.log({ web3, account, myToken });
        throw ConnectToMetaMaskError;
      }
      const inWei = web3.utils.toWei(tokensToAllow.toString(), "ether");
      await web3.eth.sendTransaction({
        from: account,
        to: MY_TOKEN_ADDRESS,
        data: myToken.methods.approve(MY_DEX_ADDRESS, inWei).encodeABI(),
      });
    });
  };

  /**
   * Buy `tokensToBuy` number of `MTKN` from `MyDex` contract by sending
   * `tokensToBuy / conversionRate` ETH to `MyDex` contract.
   * @param tokensToBuy Number of `MTKN` to buy.
   */
  const buyMyTokens = async (tokensToBuy: number) => {
    await errorWrapper(async () => {
      if (!web3 || !account || !myDex) {
        throw ConnectToMetaMaskError;
      }
      const tokensInWei = web3.utils.toWei(tokensToBuy.toString(), "ether");
      const conversionRate = +(await myDex.methods.convertionRate().call());
      const ethInWei = +tokensInWei / conversionRate;
      await web3.eth.sendTransaction({
        from: account,
        to: MY_DEX_ADDRESS,
        data: myDex.methods.buy().encodeABI(),
        value: ethInWei.toString(),
      });
    });
  };

  /**
   * Sell `tokensToSell` number of `MTKN` to `MyDex` contract. User returns
   * `tokensToSell` number of `MTKN` tokens to `MyDex` contract, and `MyDex`
   * contract sends `tokensToSell / conversionRate` ETH to the user's account.
   * @param tokensToSell Number of `MTKN` to sell.
   */
  const sellMyTokens = async (tokensToSell: number) => {
    await errorWrapper(async () => {
      if (!web3 || !account || !myDex) {
        throw ConnectToMetaMaskError;
      }
      const tokensInWei = web3.utils.toWei(tokensToSell.toString(), "ether");
      await web3.eth.sendTransaction({
        from: account,
        to: MY_DEX_ADDRESS,
        data: myDex.methods.sell(tokensInWei).encodeABI(),
      });
    });
  };

  /**
   * Gets the number of `ETH` and `MTKN` tokens the user and the `MyDex`
   * contract have.
   */
  const getBalances = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !myToken || !account) {
        setEthBalanceOfUser(0);
        setMyTokenBalanceOfUser(0);
        setEthBalanceOfDex(0);
        setMyTokenBalanceOfDex(0);
        throw ConnectToMetaMaskError;
      }
      // #1: ETH's in possession of USER
      let b = await web3.eth.getBalance(account);
      b = web3.utils.fromWei(b, "ether");
      setEthBalanceOfUser(+b);

      // #2: MKTN tokens in possession of USER
      b = await myToken.methods.balanceOf(account).call();
      b = web3.utils.fromWei(b, "ether");
      setMyTokenBalanceOfUser(+b);

      // #3: ETH's in possession of MyDex
      b = await web3.eth.getBalance(MY_DEX_ADDRESS);
      b = web3.utils.fromWei(b, "ether");
      setEthBalanceOfDex(+b);

      // #4: MKTN tokens in possession of MyDex
      b = await myToken.methods.balanceOf(MY_DEX_ADDRESS).call();
      b = web3.utils.fromWei(b, "ether");
      setMyTokenBalanceOfDex(+b);
    });
  };

  /**
   * Gets the number of `MTKN` tokens `MyDex` contract is allowed to spend
   * from the current user's account.
   */
  const getDexAllowance = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !myToken || !account) {
        setDexAllowance(0);
        throw ConnectToMetaMaskError;
      }
      let allowance = await myToken.methods
        .allowance(account, MY_DEX_ADDRESS)
        .call();
      allowance = web3.utils.fromWei(allowance, "ether");
      setDexAllowance(+allowance);
    });
  };

  /**
   * Updates the balances and allowance. It is used in
   * `subscribeForBalanceUpdates` to update balances and allowance whenever a
   * subscribed event is received.
   */
  const updateOnSubscribedValues = async () => {
    await getBalances();
    await getDexAllowance();
    console.log("Updated!");
  };

  /**
   * Subscribes to `Approval` event from `MyToken` contract and `Bought` and
   * `Sold` events from `MyDex` contract to update user's and `MyDex`
   * contract's balances and allowance.
   */
  const subscribeForBalanceUpdates = async () => {
    await errorWrapper(async () => {
      if (!connected || !web3 || !myToken || !account || !myDex) {
        throw ConnectToMetaMaskError;
      }
      // Subscribe to Approval event from `MyToken` contract.
      myToken.events.Approval(async (err, result) => {
        if (err) {
          throw ErrorUpdatingOnSubscribedValue;
        }
        await updateOnSubscribedValues();
      });
      // Subscribe to Bought event from `MyDex` contract.
      myDex.events.Bought(async (err, result) => {
        if (err) {
          throw ErrorUpdatingOnSubscribedValue;
        }
        await updateOnSubscribedValues();
      });
      // Subscribe to Sold event from `MyDex` contract.
      myDex.events.Sold(async (err, result) => {
        if (err) {
          throw ErrorUpdatingOnSubscribedValue;
        }
        await updateOnSubscribedValues();
      });
      console.log("Subscribed!");
    });
  };

  /**
   * Tries to set the `myToken` and `myDex` state values to `MyToken` and
   * `MyDex` contract objects respectively whenever the user connects or
   * disconnects from the wallet.
   * Note: We are using `web3` instead of `connected` in the dependency list
   * to make this effect run on connect or disconnect events. This is because
   * sometimes when the user connects to the wallet, `connected` changes to
   * true, but `web3` may still be `null` or `undefined`. This is an internal
   * problem of `@web3-react`.
   * Note: Try to play with the dependency list. 😉
   */
  useEffect(() => {
    createTokenContractObjects();
  }, [web3]);

  /**
   * Tries to get balances and allowance when the user connects to the wallet.
   * Note: This time we are using `myToken` and `myDex` in the dependency list
   * instead of `web3`. This is to make sure that `myToken` and `myDex` state
   * values are set before we try to fetch balances and allowances.
   * Note: We are also using `account` in the dependency list to run this effect
   * when the user is already connected to the wallet and changes his/her
   * account in MetaMask.
   * Note: Try to play with the dependency list. 😉
   */
  useEffect(() => {
    getBalances();
    getDexAllowance();
  }, [myToken, myDex, account]);

  /**
   * This effect is responsible for subscribing to events generated by `MyToken`
   * and `MyDex` samrt contract.
   * Note: We are using `myToken` in the dependency list instead of `web3`. This
   * is to make sure that `myToken` and `myDex` state value is set before we try
   * to subscribe to events.
   * Note: Try to play with the dependency list. 😉
   */
  useEffect(() => {
    subscribeForBalanceUpdates();
  }, [myToken, myDex]);

  const value: State = {
    // ...initialState,
    loading,
    errorMsg,
    isEthereumAvailable,
    connected,
    connect,
    disconnect,
    account,
    ethBalanceOfUser,
    myTokenBalanceOfUser,
    ethBalanceOfDex,
    myTokenBalanceOfDex,
    dexAllowance,
    allowDex,
    buyMyTokens,
    sellMyTokens,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
