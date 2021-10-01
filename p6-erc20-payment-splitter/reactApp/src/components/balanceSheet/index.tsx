import { FC } from "react";
// import { useAppContext } from "../../context/appContextProvider";

const BalanceSheet: FC = () => {
  // const {} = useAppContext();
  const sheet = [
    {
      address: "0x105166796Dcd6E03f27Ee77D9fd94Efa5562801a",
      shares: 1000,
      daiBalance: 100,
      pending: 500,
      received: 100,
    },
    {
      address: "0x45ad3166",
      shares: 500,
      daiBalance: 200,
      pending: 100,
      received: 200,
    },
  ];

  return (
    <div>
      <table>
        <tr>
          <th>Address</th>
          <th>Shares (SHA)</th>
          <th>Balance (FDAI)</th>
          <th>Pending Payment (FDAI)</th>
          <th>Released Payment (FDAI)</th>
        </tr>
        {sheet.map(item => (
          <tr key={item.address}>
            <td>
              {item.address.slice(0, 5)}...
              {item.address.slice(item.address.length - 5)}
            </td>
            <td>{item.shares}</td>
            <td>{item.daiBalance}</td>
            <td>{item.pending}</td>
            <td>{item.received}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default BalanceSheet;
