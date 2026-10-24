import { motion } from "framer-motion";
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
  const monthlyRent = Number(room?.price || hostel?.monthlyRent || 0);
  const months = Math.max(Number(duration) || 1, 1);
  const total = monthlyRent * months;

  const formattedRent = monthlyRent.toLocaleString("en-IN");
  const formattedTotal = total.toLocaleString("en-IN");

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
      aria-label="Booking summary"
    >
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 dark:border-slate-800 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
            Booking Summary
          </p>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
            <FaCheckCircle aria-hidden="true" />
          </span>
        </div>

        <h2 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-slate-900 dark:text-white">
          {hostel?.propertyTitle || "Selected Hostel"}
        </h2>

        {hostel?.city && (
          <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FaMapMarkerAlt className="shrink-0 text-indigo-500" aria-hidden="true" />
            <span className="truncate">{hostel.city}</span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {/* Selected room */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
            <FaBed aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Selected Room
            </p>
            <p className="mt-0.5 truncate text-base font-bold text-slate-900 dark:text-white">
              {room?.roomNumber ? `Room ${room.roomNumber}` : "Room"}
            </p>
            <p className="mt-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {room?.roomType || "Standard"}
            </p>
          </div>
        </div>

        {/* Booking details */}
        <div className="space-y-4">
          <SummaryRow
            icon={<FaCalendarAlt />}
            label="Start date"
            value={
              startDate
                ? new Date(`${startDate}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Not selected"
            }
          />
          <SummaryRow
            icon={<FaClock />}
            label="Duration"
            value={`${months} month${months > 1 ? "s" : ""}`}
          />
          <SummaryRow
            icon={<FaRupeeSign />}
            label="Monthly rent"
            value={`₹${formattedRent}`}
          />
          {room?.availableBeds !== undefined && room?.availableBeds !== null && (
            <SummaryRow
              icon={<FaUsers />}
              label="Available beds"
              value={`${room.availableBeds} bed${Number(room.availableBeds) !== 1 ? "s" : ""}`}
            />
          )}
        </div>

        <div className="my-6 border-t border-dashed border-slate-200 dark:border-slate-700" />

        {/* Total */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 dark:bg-slate-800">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-indigo-500/20 blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">
                Estimated total
              </p>
              <p className="mt-1 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                ₹{formattedTotal}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg text-emerald-400">
              <FaCheckCircle aria-hidden="true" />
            </span>
          </div>
          <p className="relative mt-3 text-xs text-slate-400">
            ₹{formattedRent} × {months} month{months > 1 ? "s" : ""}
          </p>
        </div>

        {/* Security note */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" aria-hidden="true" />
          <p className="text-xs leading-5 text-emerald-800 dark:text-emerald-300">
            Final amount will be verified securely by StudNest before payment.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm text-indigo-500 dark:bg-slate-800 dark:text-indigo-400">
          {icon}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <span className="max-w-[55%] break-words text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}
