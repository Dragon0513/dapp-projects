import { FC } from "react";
// import { useAppContext } from "../../context/appContextProvider";

const SplitterBalances: FC = () => {
  // const {} = useAppContext();

  return (
    <div className="mb-high">
      <h3 className="centered">Payment Splitter</h3>
      <div className="row">
        <div className="col tile">
          <p className="mb-low centered">{2800} FDAI</p>
          <p className="mt-low centered">Current Balance</p>
        </div>
        <div className="col tile">
          <p className="mb-low centered">{4000} FDAI</p>
          <p className="mt-low centered">Total Received</p>
        </div>
        <div className="col tile">
          <p className="mb-low centered">{1200} FDAI</p>
          <p className="mt-low centered">Total Released</p>
        </div>
      </div>
    </div>
  );
};

export default SplitterBalances;
