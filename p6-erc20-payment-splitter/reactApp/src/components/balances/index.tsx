import { FC } from "react";
import { useInjectedContext } from "../../context/injectedContext";

const Balances: FC = () => {
  const { loading, userShares, userDaiBalance, get500Shares, get1000Dai } =
    useInjectedContext();

  const formater = new Intl.NumberFormat("us", {
    maximumFractionDigits: 4,
  });

  return (
    <div>
      <p className="centered mt-high">Your Balances</p>
      <div className="row">
        <div className="col">
          <p>{formater.format(userShares)} SHA</p>
          <button
            onClick={get500Shares}
            disabled={loading}
            title={
              "Get 500 share tokens so you can be " +
              "a share holder in the paymenr splitter."
            }
          >
            Get 500 SHA
          </button>
        </div>
        <div className="col">
          <p>{formater.format(userDaiBalance)} FDAI</p>
          <button
            onClick={get1000Dai}
            disabled={loading}
            title={
              "Get 1000 fake DAIs so you can later send them to the " +
              "payment splitter to see it in action."
            }
          >
            Get 1000 FDAI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balances;
