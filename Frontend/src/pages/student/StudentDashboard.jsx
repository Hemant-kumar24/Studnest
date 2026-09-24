import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBed,
  FaCalendarCheck,
  FaClipboardList,
  FaExclamationCircle,
  FaHome,
  FaSearch,
} from "react-icons/fa";

import HostelCard from "../../components/hostel/HostelCard";
import QuickAction from "../../components/student/QuickAction";
import { getHostels } from "../../services/hostelService";
import { getMyBookings } from "../../services/studentDashboardService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [hostels, setHostels] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [hostelRes, bookingRes] = await Promise.all([
          getHostels({
            page: 1,
            limit: 4,
            sort: "-rating",
          }),
          getMyBookings({
            page: 1,
            limit: 1,
          }),
        ]);

        // Backend returns:
        // { count, hostels }
        setHostels(
          hostelRes.data?.hostels ||
            hostelRes.data?.data ||
            []
        );

        // Handle different possible booking response formats
        const bookings =
          bookingRes.data?.data ||
          bookingRes.data?.bookings ||
          [];

        setBooking(bookings[0] || null);
      } catch (err) {
        console.error("Student dashboard error:", err);
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const firstName =
    user?.name?.split(" ")?.[0] || "Student";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-100">
                Student Dashboard
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {firstName} 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Find a comfortable and affordable place to stay
                near your college.
              </p>
            </div>

            <Link
              to="/student/hostels"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-md transition hover:bg-indigo-50 hover:shadow-lg"
            >
              <FaSearch />
              Find a Hostel
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-white/5" />
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Quick Access
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              What would you like to do?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <QuickAction
              icon="🏠"
              title="Find Hostel"
              description="Explore available stays"
              to="/student/hostels"
            />

            <QuickAction
              icon="📋"
              title="My Bookings"
              description="Track your bookings"
              to="/student/bookings"
            />

            <QuickAction
              icon="🛠️"
              title="Complaints"
              description="Get support"
              to="/student/complaints"
            />

            <QuickAction
              icon="⭐"
              title="My Reviews"
              description="Manage your reviews"
              to="/student/reviews"
            />
          </div>
        </section>

        {/* Recommended Hostels */}
        <section className="mb-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Discover
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                Recommended Hostels
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Top-rated stays selected for you.
              </p>
            </div>

            <Link
              to="/student/hostels"
              className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:inline-flex dark:text-indigo-400"
            >
              View all
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <HostelSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-slate-900">
              <FaExclamationCircle className="mx-auto mb-3 text-3xl text-red-500" />

              <h3 className="font-bold text-slate-900 dark:text-white">
                Unable to load dashboard
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && hostels.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <FaHome className="mx-auto mb-3 text-3xl text-slate-300" />

              <p className="font-medium text-slate-600 dark:text-slate-300">
                No hostels available right now.
              </p>
            </div>
          )}

          {!loading && !error && hostels.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {hostels.map((hostel) => (
                  <HostelCard
                    key={hostel._id}
                    hostel={hostel}
                  />
                ))}
              </div>

              <Link
                to="/student/hostels"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 sm:hidden dark:text-indigo-400"
              >
                View all hostels
                <FaArrowRight className="text-xs" />
              </Link>
            </>
          )}
        </section>

        {/* Recent Booking */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Stay
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                Recent Booking
              </h2>
            </div>

            <Link
              to="/student/bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View bookings
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {booking ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                    <FaBed className="text-xl text-indigo-600 dark:text-indigo-400" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {booking.hostelId?.propertyTitle ||
                        "Hostel"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {booking.roomId?.roomNumber
                        ? `Room ${booking.roomId.roomNumber}`
                        : booking.roomType || "Room"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Booking Status
                    </p>

                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <FaCalendarCheck />
                      {booking.status}
                    </span>
                  </div>

                  <Link
                    to={`/student/bookings/${booking._id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                  >
                    Details
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                <FaClipboardList className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white">
                No booking yet
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Explore hostels and find your perfect stay.
              </p>

              <Link
                to="/student/hostels"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Explore Hostels
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function HostelSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}