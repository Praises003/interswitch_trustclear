import useSWR from "swr";
import axios from "axios";
import api from "./../../api/client"

const fetcher = (url) => api.get(url).then(res => res.data);

const FraudAnalytics = () => {
  const { data, error, isLoading } = useSWR(
    "/analytics/chargeback",
    fetcher,
    {
      refreshInterval: 5000, // 🔥 auto refresh
    }
  );

  if (isLoading) return <p>Loading analytics...</p>;
  if (error) return <p>Error loading analytics</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">📊 Fraud Analytics</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-xl">
          <p>Total Complaints</p>
          <h3 className="text-2xl font-bold">{data.totalComplaints}</h3>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <p>False Complaints</p>
          <h3 className="text-2xl font-bold">{data.falseComplaints}</h3>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl">
          <p>Fraud Rate</p>
          <h3 className="text-2xl font-bold">
            {data?.fraudRate?.toFixed(2)}%
          </h3>
        </div>
      </div>

      <h3 className="font-semibold mb-2">🚨 Top Offenders</h3>

      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">False Complaints</th>
          </tr>
        </thead>
        <tbody>
          {data?.topOffenders?.map((user, index) => (
            <tr key={index}>
              <td className="p-2 border">{user.userId}</td>
              <td className="p-2 border text-red-600 font-bold">
                {user._count.userId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-green-500 mt-4 animate-pulse">
        ● Live Updates Active
      </p>
    </div>
  );
};

export default FraudAnalytics;