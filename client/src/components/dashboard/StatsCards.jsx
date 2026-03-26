import useStats from "../../hooks/useStats";
import StatCard from "../ui/StatCard";

export default function StatsCards() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return <div className="text-gray-400">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      <StatCard title="Total Transactions" value={stats?.totalTransactions} />
      <StatCard title="Successful" value={stats?.successfulTransactions} color="green" />
      <StatCard title="Anomalies" value={stats?.anomaliesDetected} color="red" />
      <StatCard title="Refunds" value={stats?.refundsIssued} color="purple" />
      <StatCard title="High Risk" value={stats?.highRiskTransactions} color="yellow" />
    </div>
  );
}