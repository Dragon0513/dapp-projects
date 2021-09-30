import { FC, useState } from "react";
import { useAppContext } from "../../context/appContextProvider";

const Profile: FC = () => {
  const [delegatee, setDelegatee] = useState("");
  const {
    loading,
    account,
    voteTokenBalanceOfUser,
    votingPowerOfUser,
    currentDelegatee,
    delegateVotes,
  } = useAppContext();

  return (
    <div>
      <p>Token Balance: {voteTokenBalanceOfUser} MVTKN</p>
      <p>Your Votes: {votingPowerOfUser}</p>
      <p>Current Delegatee: {currentDelegatee}</p>
      <hr />
      <p className="centered">Delegate Your Votes</p>
      <div className="btn-container">
        <input
          type="text"
          name="delegatee"
          value={delegatee}
          onChange={e => setDelegatee(e.target.value)}
          placeholder="Delegatee Address"
          className="item"
        />
        <button
          onClick={() => delegateVotes(delegatee)}
          disabled={loading || delegatee.length !== 42}
        >
          Delegate Votes
        </button>
      </div>
      <div className="line">
        <p className="centered">OR</p>
      </div>
      <div className="btn-container">
        <button
          onClick={() => {
            account && delegateVotes(account);
          }}
          disabled={loading || currentDelegatee === "Yourself"}
        >
          Delegate Votes to Yourself
        </button>
      </div>
    </div>
  );
};

export default Profile;
