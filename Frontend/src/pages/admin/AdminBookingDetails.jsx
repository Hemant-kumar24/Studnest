import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAdminBooking,
  approveBooking,
  rejectBooking,
} from "../../services/adminBookingService";
import BookingStatusBadge from "../../components/admin/BookingStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminBookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminBooking(id);

      setBooking(
        response.data?.data ||
          response.data?.booking ||
          null
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const approve = async () => {
    try {
      setWorking(true);
      setError("");

      await approveBooking(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorking(false);
    }
  };

  const reject = async () => {
    const reason = window.prompt(
      "Enter rejection reason:",
      ""
    );

    if (reason === null) return;

    try {
      setWorking(true);
      setError("");

      await rejectBooking(id, reason);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Loading booking...
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            {error || "Booking not found."}
          </p>

          <Link
            to="/admin/bookings"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

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

  const canApprove = [
    "pending",
    "approved",
  ].includes(status);

  const canReject = [
    "pending",
    "approved",
  ].includes(status);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-6">
          <Link
            to="/admin/bookings"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <span>←</span>
            Back to Bookings
          </Link>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Booking Details
              </p>

              <h1 className="break-all text-xl font-bold text-slate-900 sm:text-2xl">
                Booking #{booking._id}
              </h1>
            </div>

            <BookingStatusBadge status={booking.status} />
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Details Grid */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {/* Student */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <i className="fas fa-user" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Student
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Name"
                value={student.name || "-"}
              />

              <DetailRow
                label="Email"
                value={student.email || "-"}
              />

              <DetailRow
                label="Phone"
                value={student.phone || "-"}
              />
            </div>
          </article>

          {/* Hostel */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <i className="fas fa-building" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Hostel
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Property"
                value={hostel.propertyTitle || "-"}
              />

              <DetailRow
                label="Address"
                value={hostel.address || "-"}
              />

              <DetailRow
                label="City"
                value={hostel.city || "-"}
              />
            </div>
          </article>

          {/* Room */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <i className="fas fa-door-open" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Room
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Room Number"
                value={room.roomNumber || "-"}
              />

              <DetailRow
                label="Type"
                value={
                  room.roomType ||
                  booking.roomType ||
                  "-"
                }
              />

              <DetailRow
                label="Price"
                value={`₹${Number(
                  room.price ||
                    booking.amount ||
                    0
                ).toLocaleString()}`}
              />
            </div>
          </article>

          {/* Booking */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <i className="fas fa-calendar-check" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Booking
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Start"
                value={
                  booking.startDate
                    ? new Date(
                        booking.startDate
                      ).toLocaleDateString()
                    : "-"
                }
              />

              <DetailRow
                label="End"
                value={
                  booking.endDate
                    ? new Date(
                        booking.endDate
                      ).toLocaleDateString()
                    : "-"
                }
              />

              <DetailRow
                label="Duration"
                value={`${booking.duration || "-"} month(s)`}
              />

              <DetailRow
                label="Amount"
                value={`₹${Number(
                  booking.amount || 0
                ).toLocaleString()}`}
              />
            </div>
          </article>

          {/* Payment */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <i className="fas fa-credit-card" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Payment
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Status"
                value={
                  booking.paymentStatus ||
                  "Pending"
                }
              />

              <DetailRow
                label="Payment ID"
                value={
                  booking.paymentId || "-"
                }
              />
            </div>
          </article>
        </section>

        {/* Actions */}
        {(canApprove || canReject) && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Booking Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the current booking request.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {canApprove && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={approve}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {working
                      ? "Processing..."
                      : "Approve Booking"}
                  </button>
                )}

                {canReject && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={reject}
                    className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {working
                      ? "Processing..."
                      : "Reject Booking"}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="break-words font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}