import DashboardLayout from "../layouts/DashboardLayout";
import StatsCards from "../components/dashboard/StatsCards";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import FraudAnalytics from "../components/dashboard/FraudAnalytics";

export default function Dashboard() {
  return (
    <DashboardLayout>
     <div className="space-y-6">
  <StatsCards />

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2">
      <TransactionsTable />
    </div>

    <ActivityFeed />
  </div>

  {/* Fraud Analytics full width */}
  <FraudAnalytics />
</div>
    </DashboardLayout>
  );
}