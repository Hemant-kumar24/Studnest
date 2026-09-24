import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRedo,
  FaSearch,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import adminStudentService from "../../services/adminStudentService";
import StudentCard from "../../components/admin/StudentCard";
import { getApiErrorMessage } from "../../utils/apiError";

const tabs = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Inactive",
    value: "Inactive",
  },
];

export default function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const response =
        await adminStudentService.getStudents(
          params
        );

      const studentList =
        response?.students ||
        response?.data ||
        [];

      setStudents(
        Array.isArray(studentList)
          ? studentList
          : []
      );

      setPagination(
        response?.pagination || null
      );
    } catch (err) {
      console.error(
        "Load students error:",
        err
      );

      setStudents([]);
      setPagination(null);

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [page, status]);

  const submitSearch = (event) => {
    event.preventDefault();

    setPage(1);

    loadStudents();
  };

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              <FaUsers />
              Admin Panel
            </div>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Students
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage registered students and inspect
              their activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadStudents}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <FaRedo
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </section>

        {/* SEARCH + FILTER */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={submitSearch}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search name, email or phone..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() =>
                  changeStatus(tab.value)
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  status === tab.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading students...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          students.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <FaUsers className="text-xl text-slate-400" />
              </div>

              <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                No students found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search or status filter.
              </p>
            </div>
          )}

        {/* STUDENTS */}
        {!loading &&
          students.length > 0 && (
            <div className="space-y-3">
              {students.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onView={(id) =>
                    navigate(
                      `/admin/students/${id}`
                    )
                  }
                />
              ))}
            </div>
          )}

        {/* PAGINATION */}
        {!loading &&
          pagination &&
          pagination.pages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto dark:border-slate-700 dark:text-slate-300"
              >
                <FaArrowLeft />
                Previous
              </button>

              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Page {pagination.page} of{" "}
                {pagination.pages}
              </span>

              <button
                type="button"
                disabled={
                  page >= pagination.pages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          )}
      </div>
    </main>
  );
}