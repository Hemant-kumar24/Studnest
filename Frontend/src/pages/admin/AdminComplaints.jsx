import { useEffect, useState } from "react";
import {
  FaExclamationCircle,
  FaHeadset,
} from "react-icons/fa";

import AdminComplaintCard from "../../components/admin/AdminComplaintCard";

import {
  getAdminComplaints,
} from "../../services/adminComplaintService";

import { getApiErrorMessage } from "../../utils/apiError";

const tabs = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Open",
    value: "Open",
  },
  {
    label: "In Progress",
    value: "In Progress",
  },
  {
    label: "Resolved",
    value: "Resolved",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
];

const categories = [
  "Room",
  "Food",
  "Cleanliness",
  "Maintenance",
  "Electricity",
  "Water",
  "Security",
  "Staff",
  "Payment",
  "Other",
];

export default function AdminComplaints() {
  const [complaints, setComplaints] =
    useState([]);

  const [status, setStatus] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminComplaints({
          page,
          limit: 10,
          ...(status
            ? { status }
            : {}),
          ...(category
            ? { category }
            : {}),
        });

      setComplaints(
        response.data?.complaints ||
          response.data?.data ||
          []
      );

      setPagination(
        response.data?.pagination ||
          null
      );
    } catch (err) {
      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status, category]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Admin Panel
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Complaints & Support
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Review student issues and manage
            their resolution.
          </p>
        </section>

        {/* Category Filter */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-slate-700"
            >
              Filter by Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(
                  e.target.value
                );
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>
        </section>

        {/* Status Tabs */}
        <nav className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => {
              const active =
                status === tab.value;

              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setStatus(
                      tab.value
                    );
                    setPage(1);
                  }}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Loading complaints...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          complaints.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FaHeadset className="text-xl" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                No complaints found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                No complaints match the
                selected filters.
              </p>
            </div>
          )}

        {/* Complaint List */}
        {!loading &&
          complaints.length > 0 && (
            <section className="space-y-4">
              {complaints.map(
                (complaint) => (
                  <AdminComplaintCard
                    key={
                      complaint._id
                    }
                    complaint={
                      complaint
                    }
                  />
                )
              )}
            </section>
          )}

        {/* Pagination */}
        {pagination &&
          pagination.pages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (p) => p - 1
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                ← Previous
              </button>

              <span className="text-sm font-medium text-slate-600">
                Page{" "}
                <span className="font-bold text-slate-900">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {pagination.pages}
                </span>
              </span>

              <button
                type="button"
                disabled={
                  page >=
                  pagination.pages
                }
                onClick={() =>
                  setPage(
                    (p) => p + 1
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Next →
              </button>
            </div>
          )}
      </div>
    </main>
  );
}