import clsx from "clsx";

const statusStyles = {
  SUCCESS: "bg-green-500/10 text-green-400",
  FAILED: "bg-red-500/10 text-red-400",
  PENDING: "bg-yellow-500/10 text-yellow-400",
  REFUNDED: "bg-purple-500/10 text-purple-400",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-medium",
        statusStyles[status] || "bg-gray-500/10 text-gray-400"
      )}
    >
      {status}
    </span>
  );
}