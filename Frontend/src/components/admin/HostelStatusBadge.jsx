import React from "react";

export default function HostelStatusBadge({ status }) {
  const value = status || "pending";
  const normalized = String(value).toLowerCase();

  const styles = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
    approved:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
    rejected:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300",
    inactive:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300",
  };

  const style =
    styles[normalized] ||
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300";

  const label =
    normalized.charAt(0).toUpperCase() + normalized.slice(1);

  const dotColor = {
    approved: "bg-emerald-500",
    pending: "bg-amber-500",
    rejected: "bg-red-500",
    inactive: "bg-slate-400",
  }[normalized] || "bg-slate-400";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${style}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
      />
      <span>{label}</span>
    </span>
  );
}
