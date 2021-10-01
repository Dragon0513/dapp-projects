import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";

const SplitterBalances: FC = () => {
  const { splitterData } = useAppContext();

  const formater = new Intl.NumberFormat("us", {
    maximumFractionDigits: 4,
  });

  return (
    <div className="mb-high">
      <h3 className="centered">Payment Splitter</h3>
      <div className="row">
        <div className="col tile">
          <p className="mb-low centered">
            {formater.format(splitterData.currentBalance)} FDAI
          </p>
          <p className="mt-low centered">Current Balance</p>
        </div>
        <div className="col tile">
          <p className="mb-low centered">
            {formater.format(splitterData.totalReceived)} FDAI
          </p>
          <p className="mt-low centered">Total Received</p>
        </div>
        <div className="col tile">
          <p className="mb-low centered">
            {formater.format(splitterData.totalReleased)} FDAI
          </p>
          <p className="mt-low centered">Total Released</p>
        </div>
      </div>
    </div>
  );
};

export default SplitterBalances;
