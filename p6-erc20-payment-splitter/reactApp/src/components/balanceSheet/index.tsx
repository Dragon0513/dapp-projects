import { FC } from "react";
import { useInjectedContext } from "../../context/injectedContext";
import { useNetworkContext } from "../../context/networkContext";

const BalanceSheet: FC = () => {
  const { account } = useInjectedContext();
  const { shareHolders } = useNetworkContext();

  const formater = new Intl.NumberFormat("us", {
    maximumFractionDigits: 4,
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="med-text">Address</th>
            <th className="med-text">Shares (SHA)</th>
            <th className="med-text">Balance (FDAI)</th>
            <th className="med-text">Pending Payment (FDAI)</th>
            <th className="med-text">Released Payment (FDAI)</th>
          </tr>
        </thead>
        <tbody>
          {shareHolders.map(shareHolder => (
            <tr
              key={shareHolder.address}
              className={account === shareHolder.address ? "tr-current" : ""}
            >
              <td>
                {shareHolder.address.slice(0, 5)}...
                {shareHolder.address.slice(shareHolder.address.length - 5)}
              </td>
              <td>{formater.format(shareHolder.shares)}</td>
              <td>{formater.format(shareHolder.daiBalance)}</td>
              <td>{formater.format(shareHolder.pending)}</td>
              <td>{formater.format(shareHolder.received)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <p className="small-text">
        Note: The addresses in this table may be repeating. But don't worry;
        this list of share holders has nothing to do with the payment splitter's
        mechanism.
      </p>
    </div>
  );
};

export default BalanceSheet;
