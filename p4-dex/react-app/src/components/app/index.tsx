import { FC, useState } from "react";
import { useAppContext } from "../../context/appContextProvider";

export const App: FC = () => {
  const {
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
  } = useAppContext();

  const [tokensToAllow, setTokensToAllow] = useState(0);
  const [tokensToBuy, setTokensToBuy] = useState(0);
  const [tokensToSell, setTokensToSell] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <button onClick={connect} disabled={connected}>
            Connect to MetaMask
          </button>
          <button onClick={disconnect} disabled={!connected || loading}>
            Disconnect
          </button>
        </div>
        {!isEthereumAvailable && <p id="error">MetaMask not installed!</p>}
        <p>{connected ? `Connected with ${account}` : "Not Connected"}</p>
        {connected && (
          <>
            <div className="container">
              <div className="item">
                <h3>User</h3>
                <p>
                  {ethBalanceOfUser} ETH, {myTokenBalanceOfUser} MTKN
                </p>
              </div>
              <div className="item">
                <h3>Dex</h3>
                <p>
                  {ethBalanceOfDex} ETH, {myTokenBalanceOfDex} MTKN
                </p>
              </div>
            </div>
            <p>Dex's Allowance: {dexAllowance} MTKN</p>
            <div className="container">
              <input
                type="number"
                name="tokensToAllow"
                value={tokensToAllow}
                onChange={e => setTokensToAllow(+e.target.value)}
              />
              <button
                onClick={() => allowDex(tokensToAllow)}
                disabled={loading || tokensToAllow <= 0}
              >
                Allow Farm to get {tokensToAllow} MTKN
              </button>
            </div>
            <button
              onClick={() => allowDex(0)}
              disabled={loading || dexAllowance <= 0}
            >
              Reset Farm Allowance
            </button>
            <div className="container">
              <input
                type="number"
                name="tokensToBuy"
                value={tokensToBuy}
                onChange={e => setTokensToBuy(+e.target.value)}
              />
              <button
                onClick={() => buyMyTokens(tokensToBuy)}
                disabled={loading || tokensToBuy <= 0}
              >
                Buy {tokensToBuy} MKTN from MyDex
              </button>
            </div>
            <div className="container">
              <input
                type="number"
                name="tokensToSell"
                value={tokensToSell}
                onChange={e => setTokensToSell(+e.target.value)}
              />
              <button
                onClick={() => sellMyTokens(tokensToSell)}
                disabled={
                  loading || tokensToSell <= 0 || dexAllowance < tokensToSell
                }
              >
                Sell {tokensToSell} MKTN to Dex
              </button>
            </div>
            {errorMsg && <pre id="error">{errorMsg}</pre>}
          </>
        )}
      </header>
    </div>
  );
};

export default App;
