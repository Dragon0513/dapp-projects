import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components";
import {
  InjectedConnectorProvider,
  NetworkConnectorProvider,
  getLibrary,
} from "./web3React/providers";
import { InjectedContextProvider } from "./context/injectedContext";
import { NetworkContextProvider } from "./context/networkContext";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <InjectedConnectorProvider getLibrary={getLibrary}>
      <NetworkConnectorProvider getLibrary={getLibrary}>
        <NetworkContextProvider>
          <InjectedContextProvider>
            <App />
          </InjectedContextProvider>
        </NetworkContextProvider>
      </NetworkConnectorProvider>
    </InjectedConnectorProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
