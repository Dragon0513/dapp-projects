import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";
import { Views } from "../../types";

const AllProposals: FC = () => {
  const { proposalIds, setCurrentProposalId, setView } = useAppContext();

  if (proposalIds.length === 0) {
    return <p className="centered">No proposals yet. :(</p>;
  }
  return (
    <div>
      {proposalIds.map(id => (
        <p
          onClick={() => {
            setCurrentProposalId(id);
            setView(Views.Proposal);
          }}
          key={id}
          className="box"
        >
          Id: {id.slice(0, 15)}...{id.slice(id.length - 15)}
        </p>
      ))}
    </div>
  );
};

export default AllProposals;
