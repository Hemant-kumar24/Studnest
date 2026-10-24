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
      setBooking(response.data?.data || response.data?.booking || null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const reason = window.prompt("Enter rejection reason:", "");
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
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          Loading booking...
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-full bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="font-medium text-red-700 dark:text-red-300">
            {error || "Booking not found."}
          </p>
          <Link
            to="/admin/bookings"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  const student = booking.userId || booking.user || booking.student || {};
  const hostel = booking.hostelId || booking.hostel || {};
  const room = booking.roomId || booking.room || {};
  const status = String(booking.status || "").toLowerCase();
  const canApprove = ["pending", "approved"].includes(status);
  const canReject = ["pending", "approved"].includes(status);

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-6">
          <Link
            to="/admin/bookings"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300"
          >
            <span>←</span>
            Back to Bookings
          </Link>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Booking Details
              </p>
              <h1 className="break-all text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Booking #{booking._id}
              </h1>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
        </section>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Student" icon="fas fa-user" iconStyle="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <DetailRow label="Name" value={student.name || "-"} />
            <DetailRow label="Email" value={student.email || "-"} />
            <DetailRow label="Phone" value={student.phone || "-"} />
          </DetailCard>

          <DetailCard title="Hostel" icon="fas fa-building" iconStyle="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            <DetailRow label="Property" value={hostel.propertyTitle || "-"} />
            <DetailRow label="Address" value={hostel.address || "-"} />
            <DetailRow label="City" value={hostel.city || "-"} />
          </DetailCard>

          <DetailCard title="Room" icon="fas fa-door-open" iconStyle="bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300">
            <DetailRow label="Room Number" value={room.roomNumber || "-"} />
            <DetailRow label="Type" value={room.roomType || booking.roomType || "-"} />
            <DetailRow label="Price" value={`₹${Number(room.price || booking.amount || 0).toLocaleString("en-IN")}`} />
          </DetailCard>

          <DetailCard title="Booking" icon="fas fa-calendar-check" iconStyle="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
            <DetailRow label="Start" value={booking.startDate ? new Date(booking.startDate).toLocaleDateString("en-IN") : "-"} />
            <DetailRow label="End" value={booking.endDate ? new Date(booking.endDate).toLocaleDateString("en-IN") : "-"} />
            <DetailRow label="Duration" value={`${booking.duration || "-"} month(s)`} />
            <DetailRow label="Amount" value={`₹${Number(booking.amount || 0).toLocaleString("en-IN")}`} />
          </DetailCard>

          <DetailCard title="Payment" icon="fas fa-credit-card" iconStyle="bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300" className="sm:col-span-2 xl:col-span-1">
            <DetailRow label="Status" value={booking.paymentStatus || "Pending"} />
            <DetailRow label="Payment ID" value={booking.paymentId || "-"} />
          </DetailCard>
        </section>

        {(canApprove || canReject) && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Booking Actions</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage the current booking request.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {canApprove && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={approve}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {working ? "Processing..." : "Approve Booking"}
                  </button>
                )}
                {canReject && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={reject}
                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {working ? "Processing..." : "Reject Booking"}
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

function DetailCard({ title, icon, iconStyle, className = "", children }) {
  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}>
          <i className={icon} aria-hidden="true" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-3 text-sm">{children}</div>
    </article>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="break-words font-medium text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}
