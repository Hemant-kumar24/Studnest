import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaCreditCard,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

const statusClasses = {
  Pending:
    "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800/60",
  Approved:
    "bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800/60",
  Confirmed:
    "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800/60",
  Active:
    "bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800/60",
  CheckedIn:
    "bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800/60",
  Completed:
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  Cancelled:
    "bg-red-100 text-red-800 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800/60",
  Rejected:
    "bg-red-100 text-red-800 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800/60",
};

function getStatusClass(status = "") {
  return (
    statusClasses[status] ||
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
  );
}

function formatDate(date) {
  if (!date) return "—";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";
  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  const value = Number(amount);
  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString("en-IN")}`;
}

export default function BookingCard({ booking }) {
  const hostel = booking?.hostelId;
  const room = booking?.roomId;
  const bookingId = booking?._id;

  // Payment is available only for pending/approved bookings that are unpaid.
  const canPay =
    Boolean(bookingId) &&
    booking?.paymentStatus !== "Paid" &&
    ["Pending", "Approved"].includes(booking?.status);
  const isPaid = booking?.paymentStatus === "Paid";
  const status = booking?.status || "Unknown";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Hostel and booking details */}
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                Hostel booking
              </p>
              <h3 className="break-words text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-xl">
                {hostel?.propertyTitle || "Hostel"}
              </h3>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FaMapMarkerAlt aria-hidden="true" className="shrink-0 text-indigo-500" />
                <span className="break-words">{hostel?.city || "Location unavailable"}</span>
              </p>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${getStatusClass(status)}`}
              aria-label={`Booking status: ${status}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              {status}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <DetailItem
              icon={<FaBed />}
              label="Room"
              value={room?.roomNumber ? `Room ${room.roomNumber}` : booking?.roomType || "Room details pending"}
            />
            <DetailItem
              icon={<FaCalendarAlt />}
              label="Start date"
              value={formatDate(booking?.startDate)}
            />
            <DetailItem
              icon={<FaClock />}
              label="Duration"
              value={booking?.duration ? `${booking.duration} month${Number(booking.duration) === 1 ? "" : "s"}` : "—"}
            />
          </div>
        </div>

        {/* Payment summary */}
        <div className="flex flex-col justify-center border-t border-slate-200 bg-slate-50/80 p-5 sm:p-6 lg:w-64 lg:shrink-0 lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Total amount
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {formatCurrency(booking?.amount)}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isPaid ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"}`}>
              {isPaid ? <FaCheckCircle aria-hidden="true" /> : <FaCreditCard aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${isPaid ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                {isPaid ? "Payment paid" : `Payment: ${booking?.paymentStatus || "Pending"}`}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {isPaid ? "Payment confirmed" : "Payment not completed"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">
          {bookingId ? `Booking ID: ${bookingId}` : "Booking reference unavailable"}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {bookingId ? (
            <Link
              to={`/student/bookings/${bookingId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900"
            >
              View details
              <FaArrowRight aria-hidden="true" className="text-xs transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500">
              Details unavailable
            </span>
          )}

          {canPay && (
            <Link
              to={`/student/bookings/${bookingId}/pay`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <FaCreditCard aria-hidden="true" />
              Pay now
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200/70 bg-slate-50 p-3.5 dark:border-slate-700/70 dark:bg-slate-800/60">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="text-indigo-500 dark:text-indigo-400" aria-hidden="true">{icon}</span>
        {label}
      </div>
      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200" title={String(value)}>
        {value}
      </p>
    </div>
  );
}
