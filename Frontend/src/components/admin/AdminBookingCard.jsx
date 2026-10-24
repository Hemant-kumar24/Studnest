import { Link } from "react-router-dom";
import BookingStatusBadge from "./BookingStatusBadge";

export default function AdminBookingCard({
  booking,
  workingId,
  onApprove,
  onReject,
}) {
  const student = booking.userId || booking.user || booking.student || {};
  const hostel = booking.hostelId || booking.hostel || {};
  const room = booking.roomId || booking.room || {};

  const status = String(booking.status || "").toLowerCase();
  const canApprove = status === "pending";
  const canReject = status === "pending";
  const isWorking = workingId === booking._id;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
        {/* Booking information */}
        <div className="min-w-0 space-y-4">
          <div>
            <h2 className="break-words text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {hostel.propertyTitle || "Hostel"}
            </h2>

            {hostel.city && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <i className="fas fa-location-dot text-indigo-500" aria-hidden="true" />
                {hostel.city}
              </p>
            )}

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Student:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {student.name || student.email || "-"}
              </span>
            </p>

            {student.email && student.name && (
              <p className="mt-1 break-all text-xs text-slate-400 dark:text-slate-500">
                {student.email}
              </p>
            )}
          </div>

          {/* Booking details */}
          <div className="flex flex-wrap gap-3 text-sm">
            <DetailTile label="Room">
              {room.roomNumber || booking.roomType || "-"}
            </DetailTile>

            {(room.roomType || booking.roomType) && (
              <DetailTile label="Room Type">
                {room.roomType || booking.roomType}
              </DetailTile>
            )}

            <DetailTile label="Duration">
              {booking.duration || 1} month{(booking.duration || 1) !== 1 ? "s" : ""}
            </DetailTile>

            <DetailTile label="Amount">
              ₹{Number(booking.amount || 0).toLocaleString("en-IN")}
            </DetailTile>

            <DetailTile label="Payment">
              {booking.paymentStatus || "Pending"}
            </DetailTile>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            {booking.startDate && (
              <span className="inline-flex items-center gap-1.5">
                <i className="fas fa-calendar-check text-indigo-500" aria-hidden="true" />
                Start:{" "}
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  {new Date(booking.startDate).toLocaleDateString("en-IN")}
                </strong>
              </span>
            )}

            {booking.endDate && (
              <span className="inline-flex items-center gap-1.5">
                <i className="fas fa-calendar-xmark text-indigo-500" aria-hidden="true" />
                End:{" "}
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  {new Date(booking.endDate).toLocaleDateString("en-IN")}
                </strong>
              </span>
            )}
          </div>

          {/* Student note */}
          {booking.note && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Student Note
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200">
                {booking.note}
              </p>
            </div>
          )}
        </div>

        {/* Status and actions */}
        <div className="flex flex-col items-start justify-between gap-4 md:items-end">
          <BookingStatusBadge status={booking.status} />

          <div className="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
            <Link
              to={`/admin/bookings/${booking._id}`}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-700 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900"
            >
              <i className="fas fa-eye mr-2" aria-hidden="true" />
              View
            </Link>

            {canApprove && (
              <button
                type="button"
                disabled={isWorking}
                onClick={() => onApprove(booking._id)}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
              >
                {isWorking ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Working...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2" aria-hidden="true" />
                    Approve
                  </>
                )}
              </button>
            )}

            {canReject && (
              <button
                type="button"
                disabled={isWorking}
                onClick={() => onReject(booking._id)}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
              >
                {isWorking ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Working...
                  </>
                ) : (
                  <>
                    <i className="fas fa-xmark mr-2" aria-hidden="true" />
                    Reject
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailTile({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition-colors dark:border-slate-700/70 dark:bg-slate-800/70">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <p className="font-semibold text-slate-800 dark:text-slate-100">{children}</p>
    </div>
  );
}
