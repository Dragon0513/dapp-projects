import { FC } from "react";
import { SplitterBalances, InteractWithSplitter, BalanceSheet } from "../";
import { useInjectedContext } from "../../context/injectedContext";

const Payments: FC = () => {
  const { connected } = useInjectedContext();

  return (
    <div>
      <SplitterBalances />
      {connected && <InteractWithSplitter />}
      <BalanceSheet />
    </div>
  );
};

export default Payments;
