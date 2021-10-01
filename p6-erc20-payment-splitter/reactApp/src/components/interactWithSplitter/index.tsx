import { FC, useState } from "react";

const InteractWithSplitter: FC = () => {
  const [daiToSend, setDaiToSend] = useState(0);

  return (
    <div className="col">
      <div className="btn-container">
        <input
          name="daiToSend"
          placeholder="Amount of DAI to send to Payment Splitter"
          type="number"
          value={daiToSend}
          onChange={e => setDaiToSend(+e.target.value)}
        />
        <button
          title="Send some fake DAI to Payment Splitter to see it in action!"
          onClick={() => {}}
        >
          Send Dai to Payment Splitter
        </button>
      </div>
      <button
        title="Get my pending payments from Payment Splitter."
        onClick={() => {}}
        className="mb-high"
      >
        Get My Pending Amount
      </button>
    </div>
  );
};

export default InteractWithSplitter;
