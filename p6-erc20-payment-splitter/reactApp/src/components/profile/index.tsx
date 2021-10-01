import { FC } from "react";
import { ConnectToWallet, Balances } from "../";
import { useAppContext } from "../../context/appContextProvider";

const Profile: FC = () => {
  const { connected } = useAppContext();
  return (
    <div>
      <ConnectToWallet />
      {connected && <Balances />}
    </div>
  );
};

export default Profile;
