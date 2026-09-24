import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaCreditCard,
  FaExclamationCircle,
  FaFileInvoice,
  FaHome,
  FaPen,
  FaTimesCircle,
  FaBed,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  cancelBooking,
  getBookingById,
} from "../../services/bookingService";

import { getApiErrorMessage } from "../../utils/apiError";

export default function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookingById(id);

      const bookingData =
        response.data?.data ||
        response.data?.booking ||
        null;

      setBooking(bookingData);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadBooking();
    }
  }, [id]);

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      const response = await cancelBooking(id);

      const updatedBooking =
        response.data?.data ||
        response.data?.booking ||
        null;

      if (updatedBooking) {
        setBooking(updatedBooking);
      } else {
        await loadBooking();
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="h-10 w-72 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-white shadow-sm dark:bg-slate-900"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-900 dark:bg-slate-900">
          <FaExclamationCircle className="mx-auto mb-4 text-4xl text-red-500" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Unable to load booking
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={loadBooking}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // BOOKING NOT FOUND
  // ==========================================

  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="text-center">
          <FaFileInvoice className="mx-auto mb-4 text-5xl text-slate-300" />

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Booking not found
          </h2>

          <Link
            to="/student/bookings"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FaArrowLeft />
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  const hostel = booking.hostelId;
  const room = booking.roomId;

  // ==========================================
  // ACTION CONDITIONS
  // ==========================================

  const canCancel = [
    "Pending",
    "Approved",
    "Confirmed",
  ].includes(booking.status);

  const canPay =
    booking.paymentStatus !== "Paid" &&
    ["Pending", "Approved"].includes(
      booking.status
    );

  const canComplaint = [
    "Confirmed",
    "CheckedIn",
    "Active",
  ].includes(booking.status);

  const canReview = [
    "Active",
    "CheckedIn",
    "Completed",
  ].includes(booking.status);

  // ==========================================
  // STATUS COLORS
  // ==========================================

  const statusColors = {
    Pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",

    Approved:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",

    Rejected:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

    Confirmed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

    CheckedIn:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",

    Active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

    Completed:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

    Cancelled:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const paymentColors =
    booking.paymentStatus === "Paid"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : booking.paymentStatus === "Failed"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8">
          <Link
            to="/student/bookings"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <FaArrowLeft />
            Back to bookings
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Booking Details
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {hostel?.propertyTitle || "Hostel Booking"}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FaFileInvoice />
                Booking ID: {booking._id}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                statusColors[booking.status] ||
                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <FaCheckCircle />
              {booking.status}
            </span>
          </div>
        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaExclamationCircle />
            {error}
          </div>
        )}

        {/* ========================================
            BOOKING SUMMARY
        ======================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <FaFileInvoice className="text-indigo-600" />
              Booking Summary
            </h2>
          </div>

          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:bg-slate-800">

            <InfoItem
              icon={<FaCheckCircle />}
              label="Status"
              value={booking.status || "-"}
              valueClass={
                statusColors[booking.status] ||
                "text-slate-700 dark:text-slate-300"
              }
              badge
            />

            <InfoItem
              icon={<FaCreditCard />}
              label="Payment"
              value={booking.paymentStatus || "Pending"}
              valueClass={paymentColors}
              badge
            />

            <InfoItem
              icon={<FaBed />}
              label="Room"
              value={
                room?.roomNumber
                  ? `Room ${room.roomNumber}`
                  : booking.roomType || "-"
              }
            />

            <InfoItem
              icon={<FaClock />}
              label="Duration"
              value={`${booking.duration || "-"} month(s)`}
            />

            <InfoItem
              icon={<FaCalendarAlt />}
              label="Start Date"
              value={
                booking.startDate
                  ? new Date(
                      booking.startDate
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <InfoItem
              icon={<FaCalendarAlt />}
              label="End Date"
              value={
                booking.endDate
                  ? new Date(
                      booking.endDate
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <InfoItem
              icon={<FaCreditCard />}
              label="Total Amount"
              value={`₹${Number(
                booking.amount || 0
              ).toLocaleString()}`}
              valueClass="text-lg font-bold text-indigo-600 dark:text-indigo-400"
            />

            <InfoItem
              icon={<FaFileInvoice />}
              label="Booking ID"
              value={booking._id}
              small
            />
          </div>
        </section>

        {/* ========================================
            HOSTEL INFORMATION
        ======================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <FaHome className="text-indigo-600" />
            Hostel Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Property
              </p>

              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel?.propertyTitle || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="flex items-start gap-2 font-medium text-slate-700 dark:text-slate-300">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-indigo-500" />

                {hostel?.address || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                City
              </p>

              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel?.city || "-"}
              </p>
            </div>

            {hostel?.nearbyCollege && (
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nearby College
                </p>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {hostel.nearbyCollege}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ========================================
            ROOM INFORMATION
        ======================================== */}

        {room && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <FaBed className="text-indigo-600" />
              Room Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <InfoItem
                icon={<FaBed />}
                label="Room Number"
                value={room.roomNumber || "-"}
              />

              <InfoItem
                icon={<FaHome />}
                label="Room Type"
                value={
                  room.roomType ||
                  booking.roomType ||
                  "-"
                }
              />

              <InfoItem
                icon={<FaClock />}
                label="Capacity"
                value={
                  room.capacity
                    ? `${room.capacity} beds`
                    : "-"
                }
              />
            </div>
          </section>
        )}

        {/* ========================================
            BOOKING NOTE
        ======================================== */}

        {booking.note && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              Booking Note
            </h2>

            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              {booking.note}
            </p>
          </section>
        )}

        {/* ========================================
            ACTIONS
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
            Actions
          </h2>

          <div className="flex flex-wrap gap-3">

            {/* PAY NOW */}

            {canPay && (
              <Link
                to={`/student/bookings/${booking._id}/pay`}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
              >
                <FaCreditCard />
                Pay Now
              </Link>
            )}

            {/* CANCEL BOOKING */}

            {canCancel && (
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                <FaTimesCircle />

                {cancelling
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            )}

            {/* COMPLAINT */}

            {canComplaint && (
              <Link
                to={`/student/complaints/create?bookingId=${booking._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <FaExclamationCircle />
                Raise Complaint
              </Link>
            )}

            {/* REVIEW */}

            {canReview && hostel?._id && (
              <Link
                to={`/student/reviews/create?hostelId=${hostel._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <FaPen />
                Write Review
              </Link>
            )}

            {/* VIEW HOSTEL */}

            {hostel?._id && (
              <Link
                to={`/student/hostels/${hostel._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <FaHome />
                View Hostel
              </Link>
            )}
          </div>

          {!canPay &&
            !canCancel &&
            !canComplaint &&
            !canReview &&
            !hostel?._id && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No actions are currently available
                for this booking.
              </p>
            )}
        </section>

        {/* ========================================
            CANCELLATION INFO
        ======================================== */}

        {booking.status === "Cancelled" && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <FaTimesCircle className="mt-0.5 shrink-0 text-red-500" />

              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400">
                  Booking Cancelled
                </h3>

                {booking.cancellationReason && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Reason: {booking.cancellationReason}
                  </p>
                )}

                {booking.cancelledAt && (
                  <p className="mt-1 text-xs text-red-500">
                    Cancelled on{" "}
                    {new Date(
                      booking.cancelledAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ==========================================
// INFO ITEM
// ==========================================

function InfoItem({
  icon,
  label,
  value,
  valueClass = "",
  badge = false,
  small = false,
}) {
  return (
    <div className="bg-white p-5 dark:bg-slate-900">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span className="text-indigo-500">
          {icon}
        </span>

        {label}
      </div>

      {badge ? (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${valueClass}`}
        >
          {value}
        </span>
      ) : (
        <p
          className={`break-all font-semibold text-slate-900 dark:text-white ${
            small ? "text-xs" : "text-sm"
          } ${valueClass}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}