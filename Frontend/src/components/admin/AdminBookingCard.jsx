import { Link } from "react-router-dom";
import BookingStatusBadge from "./BookingStatusBadge";

export default function AdminBookingCard({
  booking,
  workingId,
  onApprove,
  onReject,
}) {
  const student =
    booking.userId ||
    booking.user ||
    booking.student ||
    {};

  const hostel =
    booking.hostelId ||
    booking.hostel ||
    {};

  const room =
    booking.roomId ||
    booking.room ||
    {};

  const status = String(
    booking.status || ""
  ).toLowerCase();

  // Only Pending bookings can be approved/rejected
  const canApprove =
    status === "pending";

  const canReject =
    status === "pending";

  const isWorking =
    workingId === booking._id;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="grid gap-5 md:grid-cols-[1fr_auto]">

        {/* ============================= */}
        {/* BOOKING INFORMATION */}
        {/* ============================= */}

        <div className="space-y-4">

          {/* Hostel + Student */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {hostel.propertyTitle ||
                "Hostel"}
            </h2>

            {hostel.city && (
              <p className="mt-1 text-xs text-slate-400">
                <i className="fas fa-location-dot mr-1" />
                {hostel.city}
              </p>
            )}

            <p className="mt-2 text-sm text-slate-500">
              Student:{" "}
              <span className="font-semibold text-slate-700">
                {student.name ||
                  student.email ||
                  "-"}
              </span>
            </p>

            {student.email &&
              student.name && (
                <p className="mt-1 text-xs text-slate-400">
                  {student.email}
                </p>
              )}
          </div>

          {/* Booking Details */}
          <div className="flex flex-wrap gap-3 text-sm">

            {/* Room */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">
                Room
              </span>

              <p className="font-semibold text-slate-800">
                {room.roomNumber ||
                  booking.roomType ||
                  "-"}
              </p>
            </div>

            {/* Room Type */}
            {(
              room.roomType ||
              booking.roomType
            ) && (
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">
                  Room Type
                </span>

                <p className="font-semibold text-slate-800">
                  {room.roomType ||
                    booking.roomType}
                </p>
              </div>
            )}

            {/* Duration */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">
                Duration
              </span>

              <p className="font-semibold text-slate-800">
                {booking.duration || 1}{" "}
                month
                {(booking.duration || 1) !==
                1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* Amount */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">
                Amount
              </span>

              <p className="font-semibold text-slate-800">
                ₹
                {Number(
                  booking.amount || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Payment */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">
                Payment
              </span>

              <p className="font-semibold text-slate-800">
                {booking.paymentStatus ||
                  "Pending"}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">

            {booking.startDate && (
              <span>
                <i className="fas fa-calendar-check mr-1" />
                Start:{" "}
                <strong className="text-slate-700">
                  {new Date(
                    booking.startDate
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </strong>
              </span>
            )}

            {booking.endDate && (
              <span>
                <i className="fas fa-calendar-xmark mr-1" />
                End:{" "}
                <strong className="text-slate-700">
                  {new Date(
                    booking.endDate
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </strong>
              </span>
            )}
          </div>

          {/* Note */}
          {booking.note && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold text-slate-500">
                Student Note
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {booking.note}
              </p>
            </div>
          )}
        </div>

        {/* ============================= */}
        {/* STATUS + ACTIONS */}
        {/* ============================= */}

        <div className="flex flex-col items-start justify-between gap-4 md:items-end">

          {/* Status */}
          <BookingStatusBadge
            status={booking.status}
          />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">

            {/* View */}
            <Link
              to={`/admin/bookings/${booking._id}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <i className="fas fa-eye mr-2" />
              View
            </Link>

            {/* Approve */}
            {canApprove && (
              <button
                type="button"
                disabled={isWorking}
                onClick={() =>
                  onApprove(
                    booking._id
                  )
                }
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isWorking ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Working...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2" />
                    Approve
                  </>
                )}
              </button>
            )}

            {/* Reject */}
            {canReject && (
              <button
                type="button"
                disabled={isWorking}
                onClick={() =>
                  onReject(
                    booking._id
                  )
                }
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isWorking ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Working...
                  </>
                ) : (
                  <>
                    <i className="fas fa-xmark mr-2" />
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