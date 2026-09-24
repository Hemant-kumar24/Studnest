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

const getStatusClass = (status = "") => {
  const classes = {
    Pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",

    Approved:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",

    Confirmed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

    Active:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",

    CheckedIn:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",

    Completed:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

    Cancelled:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    classes[status] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  );
};

export default function BookingCard({ booking }) {
  const hostel = booking?.hostelId;
  const room = booking?.roomId;

  // Payment is allowed only while booking is pending/approved.
  // Once payment succeeds, booking becomes Confirmed + Paid.
  const canPay =
    booking?.paymentStatus !== "Paid" &&
    ["Pending", "Approved"].includes(booking?.status);

  const isPaid = booking?.paymentStatus === "Paid";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col lg:flex-row">
        {/* Hostel Info */}
        <div className="flex-1 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {hostel?.propertyTitle || "Hostel"}
              </h3>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <FaMapMarkerAlt className="text-indigo-500" />
                {hostel?.city || "Location unavailable"}
              </p>
            </div>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                booking?.status
              )}`}
            >
              {booking?.status || "Unknown"}
            </span>
          </div>

          {/* Booking Details */}
          <div className="grid gap-3 sm:grid-cols-3">
            <DetailItem
              icon={<FaBed />}
              label="Room"
              value={
                room?.roomNumber
                  ? `Room ${room.roomNumber}`
                  : booking?.roomType || "Room"
              }
            />

            <DetailItem
              icon={<FaCalendarAlt />}
              label="Start Date"
              value={
                booking?.startDate
                  ? new Date(booking.startDate).toLocaleDateString()
                  : "-"
              }
            />

            <DetailItem
              icon={<FaClock />}
              label="Duration"
              value={`${booking?.duration || "-"} month(s)`}
            />
          </div>
        </div>

        {/* Payment Info */}
        <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 lg:w-60 lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total Amount
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            ₹{Number(booking?.amount || 0).toLocaleString()}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {isPaid ? (
              <>
                <FaCheckCircle className="text-emerald-500" />

                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Payment Paid
                </span>
              </>
            ) : (
              <>
                <FaCreditCard className="text-amber-500" />

                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Payment: {booking?.paymentStatus || "Pending"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 dark:border-slate-800 dark:bg-slate-900">
        <Link
          to={`/student/bookings/${booking?._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
        >
          View Details

          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
        </Link>

        {canPay && (
          <Link
            to={`/student/bookings/${booking?._id}/pay`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
          >
            <FaCreditCard />
            Pay Now
          </Link>
        )}
      </div>
    </article>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-400">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>

      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}