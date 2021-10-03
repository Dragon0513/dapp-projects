import { FC } from "react";

const About: FC = () => {
  return (
    <div className="about-container">
      <h3 className="centered">About</h3>
      <p className="centered med-text">
        This app is a demo app for ERC20 Payment Splitter. The code for the
        contracts can be found{" "}
        <a
          href="https://github.com/SharjeelSafdar/dapp-projects/tree/main/p6-erc20-payment-splitter/smartContracts/contracts"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        . The contracts have been deployed to Ropsten. Please, open an issue{" "}
        <a
          href="https://github.com/SharjeelSafdar/dapp-projects/issues"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{" "}
        if you find any problem or have a suggestion.
      </p>
      <p className="centered med-text">
        There is already a Payment Splitter for ETH on{" "}
        <a
          href="https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol"
          target="_blank"
          rel="noreferrer"
        >
          OpenZeppelin
        </a>
        . There are many people who have implemented an ERC20 payment splitter
        to split a payment among share holders in the form of an ERC20 token by
        modifying OpenZeppelin's payment splitter for ETH. An example is{" "}
        <a
          href="https://github.com/airswap/airswap-protocols/blob/main/source/converter/contracts/TokenPaymentSplitter.sol"
          target="_blank"
          rel="noreferrer"
        >
          AirSwap
        </a>
        .
      </p>
      <p className="centered med-text">
        So, how this ERC20 payment splitter is different. Most of the ERC20
        payment splitter implementations (at least those I encountered) split
        the payments among a given list of accounts in proportion to their fixed
        shares.
      </p>
      <p className="centered med-text">
        This ERC20 payment splitter uses two ERC20 tokens. One token is the{" "}
        <b>Payment Token</b> which is used for receiving and splitting payments.
        The other is the <b>Shares Token</b>. Shares token (
        <a
          href="https://github.com/SharjeelSafdar/dapp-projects/blob/main/p6-erc20-payment-splitter/smartContracts/contracts/ERC20Shares.sol"
          target="_blank"
          rel="noreferrer"
        >
          ERC20Shares
        </a>
        ) is also an ERC20 token with some extended functionality. It snapshots
        its holders' balances and the total supply of the token when they
        change. The ERC20 Payment Splitter uses these balance snapshots and the
        total supply snapshots as the shares held by addresses and the total
        shares respectively at different points of time. Whenever a payment is
        received, each user gets a part of the payment in proportion to her/his
        balance of Shares Token at that point of time. However, the user doesn't
        receive the payment automatically. The user can get all the accumulated
        pending payments anytime.
      </p>
      <p className="centered">Benefits</p>
      <ol>
        <li className="med-text">
          There is no need to add or remove share holders.
        </li>
        <li className="med-text">
          The share holders can exchange their shares at a DEX.
        </li>
        <li className="med-text">
          The same token can be used for both share holding in a payment
          splitter and governance on a DAO.
        </li>
      </ol>
      <p className="centered">Limitations</p>
      <ol>
        <li className="med-text">
          The sender of the payment has to first allow the splitter to get the
          Payment Token from his/her address, and then, call the receivePayment
          function on the splitter.
        </li>
        <li className="med-text">
          The share holders have to manually withdraw their payments.
        </li>
      </ol>
    </div>
  );
};

export default About;
