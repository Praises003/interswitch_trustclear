import { motion } from "framer-motion";

export default function RiskBar({ score }) {
  const percentage = Math.min(score * 100, 100);

  const getColor = () => {
    if (score < 0.4) return "bg-green-500";
    if (score < 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-xs text-gray-400">
        {score.toFixed(2)}
      </span>
    </div>
  );
}