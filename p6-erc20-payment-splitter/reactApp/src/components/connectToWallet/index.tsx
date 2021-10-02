import { FC } from "react";
import { useInjectedContext } from "../../context/injectedContext";

const ConnectToWallet: FC = () => {
  const {
    loading,
    isEthereumAvailable,
    isChainSupported,
    connected,
    connect,
    disconnect,
    account,
  } = useInjectedContext();

  return (
    <>
      <div className="btn-container">
        <button onClick={connect} disabled={connected || loading}>
          Connect to MetaMask
        </button>
        <button onClick={disconnect} disabled={!connected || loading}>
          Disconnect
        </button>
      </div>
      {!isEthereumAvailable && (
        <p className="centered error">MetaMask not installed!</p>
      )}
      {!isChainSupported && (
        <p className="centered error">Chain ID not supported!</p>
      )}
      {connected ? (
        <>
          <p className="centered">Connected with</p>
          <p className="centered">{account}</p>
        </>
      ) : (
        <p className="centered">Not Connected</p>
      )}
    </>
  );
};

export default ConnectToWallet;
