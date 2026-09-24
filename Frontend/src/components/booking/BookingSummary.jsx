import {
  FaBed,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

export default function BookingSummary({
  hostel,
  room,
  duration,
  startDate,
}) {
  const monthlyRent = Number(
    room?.price || hostel?.monthlyRent || 0
  );

  const months = Math.max(
    Number(duration) || 1,
    1
  );

  const total = monthlyRent * months;

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Booking Summary
        </p>

        <h2 className="mt-1 line-clamp-2 text-lg font-extrabold text-slate-900 dark:text-white">
          {hostel?.propertyTitle ||
            "Selected Hostel"}
        </h2>

        {hostel?.city && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FaMapMarkerAlt className="text-indigo-500" />
            <span className="truncate">
              {hostel.city}
            </span>
          </div>
        )}
      </div>

      {/* Room */}
      <div className="p-5">

        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
            <FaBed />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Selected Room
            </p>

            <p className="truncate text-base font-bold text-slate-900 dark:text-white">
              {room?.roomNumber
                ? `Room ${room.roomNumber}`
                : "Room"}
            </p>

            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              {room?.roomType || "Standard"}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">

          {/* Start Date */}
          <SummaryRow
            icon={<FaCalendarAlt />}
            label="Start date"
            value={
              startDate
                ? new Date(
                    `${startDate}T00:00:00`
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Not selected"
            }
          />

          {/* Duration */}
          <SummaryRow
            icon={<FaClock />}
            label="Duration"
            value={`${months} month${
              months > 1 ? "s" : ""
            }`}
          />

          {/* Monthly Rent */}
          <SummaryRow
            icon={<FaRupeeSign />}
            label="Monthly rent"
            value={`₹${monthlyRent.toLocaleString(
              "en-IN"
            )}`}
          />

          {/* Beds */}
          {room?.availableBeds !==
            undefined && (
            <SummaryRow
              icon={<FaUsers />}
              label="Available beds"
              value={`${room.availableBeds} bed${
                Number(
                  room.availableBeds
                ) !== 1
                  ? "s"
                  : ""
              }`}
            />
          )}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-dashed border-slate-200 dark:border-slate-700" />

        {/* Total */}
        <div className="rounded-2xl bg-slate-900 p-5 dark:bg-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Total booking amount
              </p>

              <p className="mt-1 text-2xl font-extrabold text-white">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              <FaCheckCircle />
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            ₹{monthlyRent.toLocaleString("en-IN")}
            {" × "}
            {months} month
            {months > 1 ? "s" : ""}
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
          <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />

          <p className="text-xs leading-5 text-emerald-700 dark:text-emerald-400">
            Final amount will be verified securely by
            StudNest before payment.
          </p>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-indigo-500 dark:bg-slate-800 dark:text-indigo-400">
          {icon}
        </span>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>

      <span className="max-w-[55%] truncate text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}