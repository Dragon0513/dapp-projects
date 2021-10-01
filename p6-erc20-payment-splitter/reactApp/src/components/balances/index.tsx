import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";

const Balances: FC = () => {
  const { loading } = useAppContext();
  const userShares = 1000;
  const userDaiBalance = 2500;
  const get500Shares = async () => {};
  const get1000Dai = async () => {};

  return (
    <div>
      <p className="centered margin-top">Your Balances</p>
      <div className="row">
        <div className="col">
          <p>{userShares} SHA</p>
          <button onClick={get500Shares} disabled={loading}>
            Get 500 SHA
          </button>
        </div>
        <div className="col">
          <p>{userDaiBalance} FDAI</p>
          <button onClick={get1000Dai} disabled={loading}>
            Get 1000 FDAI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balances;
