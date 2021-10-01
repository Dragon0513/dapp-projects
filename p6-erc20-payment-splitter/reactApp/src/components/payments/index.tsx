import { FC } from "react";
import { SplitterBalances, InteractWithSplitter, BalanceSheet } from "../";
import { useAppContext } from "../../context/appContextProvider";

const Payments: FC = () => {
  const { connected } = useAppContext();

  return (
    <div>
      <SplitterBalances />
      {connected && <InteractWithSplitter />}
      <BalanceSheet />
    </div>
  );
};

export default Payments;
