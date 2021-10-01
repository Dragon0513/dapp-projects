import { FC } from "react";
import { useAppContext } from "../../context/appContextProvider";

const BalanceSheet: FC = () => {
  const { shareHolders, loadingData } = useAppContext();

  const formater = new Intl.NumberFormat("us", {
    maximumFractionDigits: 4,
  });

  if (loadingData) {
    return <p>Loading...</p>;
  }

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
            <tr key={shareHolder.address}>
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
