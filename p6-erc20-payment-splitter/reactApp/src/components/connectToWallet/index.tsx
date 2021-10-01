import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";

const ConnectToWallet: FC = () => {
  const {
    loading,
    isEthereumAvailable,
    connected,
    connect,
    disconnect,
    account,
  } = useAppContext();

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
      {!isEthereumAvailable && <p id="error">MetaMask not installed!</p>}
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
