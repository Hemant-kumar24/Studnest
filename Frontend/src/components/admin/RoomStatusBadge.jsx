export default function RoomStatusBadge({
  status,
  availableBeds,
  capacity,
}) {
  const normalizedStatus = String(status || "").toLowerCase();

  const calculated =
    normalizedStatus ||
    (Number(availableBeds) > 0 ? "available" : "full");

  const styles = {
    available: {
      wrapper:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
      label: "Available",
    },

    full: {
      wrapper:
        "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-500",
      label: "Full",
    },

    maintenance: {
      wrapper:
        "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      label: "Maintenance",
    },

    inactive: {
      wrapper:
        "border-slate-200 bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
      label: "Inactive",
    },
  };

  const currentStyle =
    styles[calculated] || styles.inactive;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${currentStyle.wrapper}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`}
      />

      <span>{currentStyle.label}</span>

      {capacity != null && availableBeds != null && (
        <>
          <span className="opacity-40">•</span>

          <span>
            {availableBeds}/{capacity} beds
          </span>
        </>
      )}
    </span>
  );
}