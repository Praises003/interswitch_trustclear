import { motion, AnimatePresence } from "framer-motion";
import useActivityFeed from "../../hooks/useActivityFeed";

export default function ActivityFeed() {
  const events = useActivityFeed();

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-white/5 p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Live Activity</h2>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {events.length === 0 && (
          <p className="text-gray-500 text-sm">No activity yet...</p>
        )}

        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 p-3 rounded-xl text-sm text-gray-300"
            >
              {event.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}