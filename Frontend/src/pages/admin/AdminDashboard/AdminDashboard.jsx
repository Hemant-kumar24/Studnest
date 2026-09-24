
import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  BedDouble,
  MessageCircleWarning,
  Star,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import AnalyticsTable from "../../../components/admin/AnalyticsTable";

import {
  getDashboardOverview,
  getRecentBookings,
  getHostelAnalytics,
  getComplaintAnalytics,
} from "../../../services/adminDashboardService";

import { getApiErrorMessage } from "../../../utils/apiError";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statConfig = [
  {
    key: "totalStudents",
    title: "Total Students",
    icon: Users,
    description: "Registered students",
  },
  {
    key: "totalHostels",
    title: "Total Hostels",
    icon: Building2,
    description: "Listed properties",
  },
  {
    key: "totalBookings",
    title: "Total Bookings",
    icon: CalendarCheck,
    description: "All bookings",
  },
  {
    key: "confirmedBookings",
    title: "Confirmed Bookings",
    icon: CalendarCheck,
    description: "Successfully confirmed",
  },
  {
    key: "totalRevenue",
    title: "Revenue",
    icon: CreditCard,
    description: "Successful payments",
    money: true,
  },
  {
    key: "occupancyRate",
    title: "Occupancy",
    icon: BedDouble,
    description: "Current occupancy rate",
    percentage: true,
  },
  {
    key: "openComplaints",
    title: "Open Complaints",
    icon: MessageCircleWarning,
    description: "Need attention",
  },
  {
    key: "totalReviews",
    title: "Reviews",
    icon: Star,
    description: "Student reviews",
  },
];

export default function AdminDashboard() {
  const [overview, setOverview] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          overviewRes,
          bookingsRes,
          hostelsRes,
          complaintsRes,
        ] = await Promise.all([
          getDashboardOverview(),
          getRecentBookings({ limit: 8 }),
          getHostelAnalytics({ limit: 8 }),
          getComplaintAnalytics(),
        ]);

        setOverview(
          overviewRes.data?.data ||
            overviewRes.data ||
            {}
        );

        setRecentBookings(
          bookingsRes.data?.data ||
            bookingsRes.data?.bookings ||
            []
        );

        setHostels(
          hostelsRes.data?.data ||
            hostelsRes.data?.hostels ||
            []
        );

        setComplaints(
          complaintsRes.data?.data ||
            complaintsRes.data?.complaints ||
            []
        );
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-slate-200" />
            <div className="h-4 w-80 rounded bg-slate-200" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>

            <div className="h-80 rounded-2xl bg-white shadow-sm" />
            <div className="h-80 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-semibold">
              Unable to load dashboard
            </h2>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const stats = overview.stats || overview;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Admin Panel
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor bookings, revenue, occupancy and support activity.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <Clock3 className="h-4 w-4 text-slate-500" />

            <span className="text-sm font-medium text-slate-600">
              Live Overview
            </span>

            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statConfig.map((item) => {
            const Icon = item.icon;

            let value = stats[item.key] ?? 0;

            if (item.money) {
              value = money(value);
            }

            if (item.percentage) {
              value = `${Number(value || 0).toFixed(1)}%`;
            }

            return (
              <div
                key={item.key}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                      {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-slate-50" />
              </div>
            );
          })}
        </section>

        {/* Recent Bookings */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest student booking activity
              </p>
            </div>

            <button className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-black">
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto p-2 sm:p-4">
            <AnalyticsTable
              rows={recentBookings}
              columns={[
                {
                  key: "student",
                  label: "Student",
                  render: (row) => (
                    <div>
                      <p className="font-medium text-slate-900">
                        {row.userId?.name ||
                          row.userId?.email ||
                          row.user?.name ||
                          "-"}
                      </p>

                      {row.userId?.email && (
                        <p className="text-xs text-slate-400">
                          {row.userId.email}
                        </p>
                      )}
                    </div>
                  ),
                },
                {
                  key: "hostel",
                  label: "Hostel",
                  render: (row) =>
                    row.hostelId?.propertyTitle ||
                    row.hostel?.propertyTitle ||
                    "-",
                },
                {
                  key: "amount",
                  label: "Amount",
                  render: (row) => (
                    <span className="font-semibold text-slate-900">
                      {money(row.amount)}
                    </span>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {row.status || "-"}
                    </span>
                  ),
                },
                {
                  key: "createdAt",
                  label: "Date",
                  render: (row) =>
                    row.createdAt
                      ? new Date(
                          row.createdAt
                        ).toLocaleDateString("en-IN")
                      : "-",
                },
              ]}
            />
          </div>
        </section>

        {/* Hostel Performance */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Hostel Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Booking, revenue and occupancy performance
              </p>
            </div>

            <Building2 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="overflow-x-auto p-2 sm:p-4">
            <AnalyticsTable
              rows={hostels}
              columns={[
                {
                  key: "propertyTitle",
                  label: "Hostel",
                  render: (row) => (
                    <span className="font-medium text-slate-900">
                      {row.propertyTitle ||
                        row.hostel?.propertyTitle ||
                        "-"}
                    </span>
                  ),
                },
                {
                  key: "bookings",
                  label: "Bookings",
                  render: (row) =>
                    row.bookings ??
                    row.totalBookings ??
                    0,
                },
                {
                  key: "revenue",
                  label: "Revenue",
                  render: (row) => (
                    <span className="font-semibold">
                      {money(row.revenue)}
                    </span>
                  ),
                },
                {
                  key: "occupancy",
                  label: "Occupancy",
                  render: (row) => {
                    const occupancy = Number(
                      row.occupancy ??
                        row.occupancyRate ??
                        0
                    );

                    return (
                      <div className="min-w-[130px]">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-slate-500">
                            Occupancy
                          </span>
                          <span className="font-semibold text-slate-700">
                            {occupancy.toFixed(1)}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-900"
                            style={{
                              width: `${Math.min(
                                occupancy,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                },
              ]}
            />
          </div>
        </section>

        {/* Complaints */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <MessageCircleWarning className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Complaint Overview
                </h2>

                <p className="text-sm text-slate-500">
                  Current support workload
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-2 sm:p-4">
            <AnalyticsTable
              rows={complaints}
              columns={[
                {
                  key: "status",
                  label: "Status",
                  render: (row) => (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {row.status || "-"}
                    </span>
                  ),
                },
                {
                  key: "count",
                  label: "Count",
                  render: (row) =>
                    row.count ??
                    row.total ??
                    0,
                },
                {
                  key: "category",
                  label: "Category",
                  render: (row) =>
                    row.category || "All Categories",
                },
              ]}
            />
          </div>
        </section>

      </div>
    </main>
  );
}
