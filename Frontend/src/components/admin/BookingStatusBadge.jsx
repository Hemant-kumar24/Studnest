export default function BookingStatusBadge({ status }) {
  const normalized = String(status || "Pending").toLowerCase();

  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    checkedin: "bg-purple-50 text-purple-700 border-purple-200",
    active: "bg-cyan-50 text-cyan-700 border-cyan-200",
    completed: "bg-green-50 text-green-700 border-green-200",
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
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        styles[normalized] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dots[normalized] || "bg-slate-400"
        }`}
      />

      {label}
    </span>
  );
}