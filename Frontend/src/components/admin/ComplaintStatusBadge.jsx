import React from "react";

const statusConfig = {
  Open: {
    label: "Open",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300",
  },
  "In Progress": {
    label: "In Progress",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  },
  Resolved: {
    label: "Resolved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300",
  },
};

export default function ComplaintStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Open;

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${config.className}`}
    >
      <span
        aria-hidden="true"
        className={`mr-2 h-1.5 w-1.5 shrink-0 rounded-full ${
          status === "Open"
            ? "bg-blue-500"
            : status === "In Progress"
              ? "bg-amber-500"
              : status === "Resolved"
                ? "bg-emerald-500"
                : status === "Rejected"
                  ? "bg-red-500"
                  : "bg-blue-500"
        }`}
      />
      {config.label}
    </span>
  );
}
