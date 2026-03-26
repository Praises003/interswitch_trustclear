import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-white/10 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Title */}
        <h1 className="text-xl font-semibold tracking-wide">
          TrustClear Dashboard
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          
          {/* CTA Button */}
          <motion.button
            onClick={() => navigate("/checkout")}
            className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow Effect */}
            <motion.span
              className="absolute inset-0 bg-white/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            🚀 Simulate Transaction
          </motion.button>

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
      </div>
    </header>
  );
}