export default function HostelStatusBadge({ status }) {
  const value = status || "pending";
  const normalized = value.toLowerCase();

  const styles = {
    pending:
      "bg-amber-50 text-amber-700 border-amber-200",

    approved:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    rejected:
      "bg-red-50 text-red-700 border-red-200",

    inactive:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const style =
    styles[normalized] ||
    "bg-slate-100 text-slate-600 border-slate-200";

  const label =
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized === "approved"
            ? "bg-emerald-500"
            : normalized === "pending"
              ? "bg-amber-500"
              : normalized === "rejected"
                ? "bg-red-500"
                : "bg-slate-400"
        }`}
      />

      {label}
    </span>
  );
}