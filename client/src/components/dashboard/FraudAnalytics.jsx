import useSWR from "swr";
import api from "./../../api/client";

const fetcher = (url) => api.get(url).then(res => res.data);

const FraudAnalytics = () => {
  const { data, error, isLoading } = useSWR(
    "/analytics/chargeback",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (isLoading) return <p className="p-6 text-gray-400">Loading analytics...</p>;
  if (error) return <p className="p-6 text-red-400">Error loading analytics</p>;

  return (
    <div className="w-full bg-[#0B1120] border border-gray-800 rounded-2xl p-6 shadow-lg">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          🚨 Fraud Intelligence
        </h2>

        <span className="text-xs text-gray-400">
          Live Monitoring
        </span>
      </div>

      {/* USERS */}
      <div className="space-y-4">
        {data?.users?.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 rounded-xl bg-[#111827] border border-gray-800 hover:border-gray-600 transition"
          >
            {/* USER */}
            <div>
              <p className="text-xs text-gray-400">User</p>
              <p className="text-sm text-white break-all">
                {user.userId}
              </p>
            </div>

            {/* SCORE */}
            <div>
              <p className="text-xs text-gray-400">Score</p>
              <p className={`text-lg font-bold ${
                user.fraudScore >= 70
                  ? "text-red-400"
                  : user.fraudScore >= 40
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}>
                {user.fraudScore}
              </p>
            </div>

            {/* RISK */}
            <div>
              <p className="text-xs text-gray-400">Risk</p>
              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                user.riskLevel === "HIGH"
                  ? "bg-red-500/10 text-red-400"
                  : user.riskLevel === "MEDIUM"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-green-500/10 text-green-400"
              }`}>
                {user.riskLevel}
              </span>
            </div>

            {/* FALSE */}
            <div>
              <p className="text-xs text-gray-400">False</p>
              <p className="text-white font-semibold">
                {user.falseComplaints}
              </p>
            </div>

            {/* FLAGS */}
            <div className="flex flex-wrap gap-1">
              {user.flags.map((flag, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <p className="text-xs text-green-400 mt-6 animate-pulse">
        ● Real-time fraud monitoring active
      </p>
    </div>
  );
};

export default FraudAnalytics;