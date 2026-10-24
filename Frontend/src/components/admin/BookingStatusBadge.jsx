import React from "react";

export default function BookingStatusBadge({ status }) {
  const normalized = String(status || "Pending").toLowerCase();

  const styles = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
    approved:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300",
    rejected:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300",
    cancelled:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300",
    confirmed:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
    checkedin:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-400/30 dark:bg-purple-400/10 dark:text-purple-300",
    active:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300",
    completed:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300",
  };

  const dots = {
    pending: "bg-amber-500",
    approved: "bg-blue-500",
    rejected: "bg-red-500",
    cancelled: "bg-slate-400",
    confirmed: "bg-emerald-500",
    checkedin: "bg-purple-500",
    active: "bg-cyan-500",
    completed: "bg-green-500",
  };

  const label =
    normalized === "checkedin"
      ? "Checked In"
      : normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        styles[normalized] ||
        "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          dots[normalized] || "bg-slate-400"
        }`}
      />
      <span>{label}</span>
    </span>
  );
}
