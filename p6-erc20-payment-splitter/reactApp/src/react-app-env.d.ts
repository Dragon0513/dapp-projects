/// <reference types="react-scripts" />

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_FAKE_DAI_ADDRESS: string;
      REACT_APP_SHARES_TOKEN_ADDRESS: string;
      REACT_APP_SPLITTER_ADDRESS: string;
    }
  }
}
