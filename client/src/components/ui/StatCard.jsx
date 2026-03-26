import { motion } from "framer-motion";
import clsx from "clsx";

const colorMap = {
  green: "text-green-400",
  red: "text-red-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
};

export default function StatCard({ title, value, color }) {
  return (
    <motion.div
      className="bg-[var(--card)] p-5 rounded-2xl border border-white/5 shadow-lg"
      whileHover={{ scale: 1.03 }}
    >
      <p className="text-sm text-gray-400 mb-2">{title}</p>

      <motion.h2
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx("text-2xl font-semibold", colorMap[color])}
      >
        {value ?? 0}
      </motion.h2>
    </motion.div>
  );
}