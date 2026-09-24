const statusConfig = {
  Open: {
    label: "Open",
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },

  "In Progress": {
    label: "In Progress",
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },

  Resolved: {
    label: "Resolved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  Rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200",
  },
};

export default function ComplaintStatusBadge({
  status,
}) {
  const config =
    statusConfig[status] ||
    statusConfig.Open;

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}