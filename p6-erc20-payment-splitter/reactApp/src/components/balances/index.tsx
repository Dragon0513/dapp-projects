import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";

const Balances: FC = () => {
  const { loading, userShares, userDaiBalance, get500Shares, get1000Dai } =
    useAppContext();

  const formater = new Intl.NumberFormat("us", {
    maximumFractionDigits: 4,
  });

  return (
    <div>
      <p className="centered mt-high">Your Balances</p>
      <div className="row">
        <div className="col">
          <p>{formater.format(userShares)} SHA</p>
          <button onClick={get500Shares} disabled={loading}>
            Get 500 SHA
          </button>
        </div>
        <div className="col">
          <p>{formater.format(userDaiBalance)} FDAI</p>
          <button onClick={get1000Dai} disabled={loading}>
            Get 1000 FDAI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balances;
