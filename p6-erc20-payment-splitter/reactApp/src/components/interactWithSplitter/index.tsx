import { FC, useState } from "react";
import { useAppContext } from "../../context/appContextProvider";

const InteractWithSplitter: FC = () => {
  const { loading, allowSplitter, sendSplitter, getMyPayment, userShares } =
    useAppContext();
  const [daiToSend, setDaiToSend] = useState(1000);

  return (
    <div className="mb-high">
      <div className="row">
        <input
          name="daiToSend"
          title="Amount of DAI to send to Payment Splitter"
          type="number"
          value={daiToSend}
          onChange={e => setDaiToSend(+e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="row">
        <button
          title="Allow Payment Splitter to get some fake DAI from your account!"
          onClick={() => allowSplitter(daiToSend)}
          disabled={loading || daiToSend <= 0}
        >
          Allow Payment Splitter {daiToSend} FDAI
        </button>
        <button
          title="Send some fake DAI to Payment Splitter to see it in action!"
          onClick={() => sendSplitter(daiToSend)}
          disabled={loading || daiToSend <= 0}
        >
          Send {daiToSend} FDAI to Payment Splitter
        </button>
        <button
          title="Get my pending payments from Payment Splitter."
          onClick={getMyPayment}
          disabled={loading || userShares === 0}
        >
          Get My Pending Amount
        </button>
      </div>
    </div>
  );
};

export default InteractWithSplitter;
