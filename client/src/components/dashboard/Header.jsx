import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Title */}
        <h1 className="text-xl font-semibold tracking-wide">
          TrustClear Dashboard
        </h1>

        {/* Live Status */}
        <div className="flex items-center gap-3">
          
          {/* Pulsing Dot */}
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />

          <span className="text-sm text-gray-300">
            Live System Active
          </span>
        </div>
      </div>
    </header>
  );
}