import { FC } from "react";
import { ConnectToWallet, Balances } from "../";
import { useInjectedContext } from "../../context/injectedContext";

const Profile: FC = () => {
  const { connected } = useInjectedContext();
  return (
    <div>
      <ConnectToWallet />
      {connected && <Balances />}
    </div>
  );
};

export default Profile;
