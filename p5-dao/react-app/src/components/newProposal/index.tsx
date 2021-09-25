import { FC, useState } from "react";
import { useAppContext } from "../../context/appContextProvider";

const NewProposal: FC = () => {
  const [newState, setNewState] = useState(0);
  const [description, setDescription] = useState("");
  const { loading, proposeStateUpdate, currentStateOfMyContract } =
    useAppContext();

  return (
    <div className="col">
      <p>Current State: {currentStateOfMyContract}</p>
      <input
        type="number"
        name="newState"
        value={newState}
        onChange={e => setNewState(+e.target.value)}
      />
      <input
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button
        onClick={() => proposeStateUpdate(newState, description)}
        disabled={loading || newState === currentStateOfMyContract}
      >
        Propose State Update
      </button>
    </div>
  );
};

export default NewProposal;
