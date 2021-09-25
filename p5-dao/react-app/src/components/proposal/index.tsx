import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";
import { ProposalStatus, VoteType } from "../../types";

const Proposal: FC = () => {
  const {
    account,
    loading,
    currentProposalId,
    currentProposal,
    castVote,
    cancelProposal,
    queueProposal,
    executeProposal,
    votingPowerOfUser,
    currentBlock,
  } = useAppContext();
  const {
    proposer,
    status,
    quorumVotes,
    startsIn,
    endsIn,
    timelockDelay,
    forVotes,
    againstVotes,
    abstainVotes,
    hasVoted,
  } = currentProposal;

  if (currentProposalId === "") {
    return <p>No proposal selected from "All Proposals" tab.</p>;
  }

  return (
    <div>
      <p>
        Proposal ID: {currentProposalId.slice(0, 10)}...
        {currentProposalId.slice(currentProposalId.length - 10)}
      </p>
      <p>Proposer: {proposer}</p>
      <p>Proposal Status: {ProposalStatus[status]}</p>
      <p>Current Block: {currentBlock} Block</p>
      <p>Voting Starts In: {startsIn} Block</p>
      <p>Voting Ends In: {endsIn} Block</p>
      <p>
        Timelock Delay:{" "}
        {status < ProposalStatus.Queued ? "N/A" : `${timelockDelay} sec`}
      </p>
      <p>Quorum Threshold: {quorumVotes}</p>
      <p>For Votes: {forVotes}</p>
      <p>Against Votes: {againstVotes}</p>
      <p>Abstain Votes: {abstainVotes}</p>
      <p>You Have Voted: {hasVoted ? "Yes" : "No"}</p>
      <div className="row">
        <div className="col">
          <button
            onClick={() => castVote(currentProposalId, VoteType.For)}
            disabled={
              loading ||
              votingPowerOfUser <= 0 ||
              status !== ProposalStatus.Active ||
              hasVoted
            }
          >
            Vote For
          </button>
          <button
            onClick={() => castVote(currentProposalId, VoteType.Against)}
            disabled={
              loading ||
              votingPowerOfUser <= 0 ||
              status !== ProposalStatus.Active ||
              hasVoted
            }
          >
            Vote Against
          </button>
          <button
            onClick={() => castVote(currentProposalId, VoteType.Abstain)}
            disabled={
              loading ||
              votingPowerOfUser <= 0 ||
              status !== ProposalStatus.Active ||
              hasVoted
            }
          >
            Abstain Vote
          </button>
        </div>
        <div className="col">
          <button
            onClick={() => cancelProposal(currentProposalId)}
            disabled={
              loading ||
              status === ProposalStatus.Canceled ||
              status === ProposalStatus.Executed ||
              status === ProposalStatus.Expired ||
              account !== proposer
            }
          >
            Cancel Proposal
          </button>
          <button
            onClick={() => queueProposal(currentProposalId)}
            disabled={loading || status !== ProposalStatus.Succeeded}
          >
            Queue Proposal
          </button>
          <button
            onClick={() => executeProposal(currentProposalId)}
            disabled={loading || status !== ProposalStatus.Queued}
          >
            Execute Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
