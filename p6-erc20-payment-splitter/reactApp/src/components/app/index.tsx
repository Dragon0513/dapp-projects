import { FC, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Profile, Payments, About } from "../";
import { Views } from "../../types";

const App: FC = () => {
  const [view, setView] = useState(Views.Profile);

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
      <div className="container mb-high">
        {view === Views.Profile && <Profile />}
        {view === Views.Payments && <Payments />}
        {view === Views.About && <About />}
      </div>
      <a
        href="https://github.com/SharjeelSafdar/dapp-projects/tree/main/p6-erc20-payment-splitter"
        target="_blank"
        rel="noreferrer"
        id="link"
        title="GitHub Repo"
      >
        <FaGithub />
      </a>
    </div>
  );
};

export default App;
