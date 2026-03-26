import useTransactions from "../../hooks/useTransactions";
import StatusBadge from "../ui/StatusBadge";
import RiskBar from "../ui/RiskBar";

export default function TransactionsTable() {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <div className="text-gray-400">Loading transactions...</div>;
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-white/5 overflow-hidden">
      
      <div className="p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold">Transactions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-white/5">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Issuer</th>
              <th className="text-left p-4">Merchant</th>
              <th className="text-left p-4">Risk</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Time</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4">{tx.transactionRef}</td>
                <td className="p-4">₦{tx.amount}</td>
                <td className="p-4">{tx.issuerStatus}</td>
                <td className="p-4">{tx.merchantStatus}</td>

                <td className="p-4">
                  <RiskBar score={tx.fraudScore || 0} />
                </td>

                <td className="p-4">
                  <StatusBadge status={tx.resolutionStatus} />
                </td>

                <td className="p-4 text-gray-400">
                  {new Date(tx.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}