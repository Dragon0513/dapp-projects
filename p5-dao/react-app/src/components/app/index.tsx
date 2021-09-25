import { FC } from "react";
import {
  ConnectToWallet,
  Profile,
  NewProposal,
  AllProposals,
  Proposal,
} from "../";
import { useAppContext } from "../../context/appContextProvider";
import { Views } from "../../types";

const App: FC = () => {
  const { connected, view, setView } = useAppContext();

  return (
    <div className="background">
      <ConnectToWallet />
      {connected && (
        <>
          <nav>
            <ul>
              <li
                onClick={() => setView(Views.Profile)}
                className={view === Views.Profile ? "selected" : ""}
              >
                Profile
              </li>
              <li
                onClick={() => setView(Views.NewProposal)}
                className={view === Views.NewProposal ? "selected" : ""}
              >
                New Proposal
              </li>
              <li
                onClick={() => setView(Views.AllProposals)}
                className={view === Views.AllProposals ? "selected" : ""}
              >
                All Proposals
              </li>
              <li
                onClick={() => setView(Views.Proposal)}
                className={view === Views.Proposal ? "selected" : ""}
              >
                Proposal
              </li>
            </ul>
          </nav>
          <div className="container">
            {view === Views.Profile && <Profile />}
            {view === Views.NewProposal && <NewProposal />}
            {view === Views.AllProposals && <AllProposals />}
            {view === Views.Proposal && <Proposal />}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
