/// <reference types="react-scripts" />

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_MY_CONTRACT_ADDRESS: string;
      REACT_APP_MY_VOTE_TOKEN_ADDRESS: string;
      REACT_APP_MY_TIMELOCK_CONTROLLER_ADDRESS: string;
      REACT_APP_MY_GOVERNOR_ADDRESS: string;
    }
  }
}
