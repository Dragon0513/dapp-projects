import React from "react";
import ReactDOM from "react-dom";
import { App, Web3React } from "./components";
import { AppContextProvider } from "./context/appContextProvider";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Web3React>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Web3React>
  </React.StrictMode>,
  document.getElementById("root")
);
