import { FC } from "react";
import { Profile, Payments, About } from "../";
import { useAppContext } from "../../context/appContextProvider";
import { Views } from "../../types";

const App: FC = () => {
  const { view, setView } = useAppContext();

  return (
    <div className="background">
      <h2>ERC20 Payment Splitter Demo</h2>
      <nav>
        <ul>
          <li
            onClick={() => setView(Views.Profile)}
            className={view === Views.Profile ? "selected" : ""}
          >
            Profile
          </li>
          <li
            onClick={() => setView(Views.Payments)}
            className={view === Views.Payments ? "selected" : ""}
          >
            Payments
          </li>
          <li
            onClick={() => setView(Views.About)}
            className={view === Views.About ? "selected" : ""}
          >
            About
          </li>
        </ul>
      </nav>
      <div className="container">
        {view === Views.Profile && <Profile />}
        {view === Views.Payments && <Payments />}
        {view === Views.About && <About />}
      </div>
    </div>
  );
};

export default App;
