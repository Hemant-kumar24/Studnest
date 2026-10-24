import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Search,
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import adminStudentService from "../../services/adminStudentService";
import StudentCard from "../../components/admin/StudentCard";
import { getApiErrorMessage } from "../../utils/apiError";

const tabs = [
  { label: "All students", value: "", icon: Users },
  { label: "Active", value: "Active", icon: UserCheck },
  { label: "Inactive", value: "Inactive", icon: UserX },
];

export default function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      document.documentElement.classList.contains("dark")
    );
  });

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(
        localStorage.getItem("theme") === "dark" ||
          document.documentElement.classList.contains("dark")
      );
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("studnest-theme-changed", syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("studnest-theme-changed", syncTheme);
      observer.disconnect();
    };
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10 };
      if (submittedSearch.trim()) params.search = submittedSearch.trim();
      if (status) params.status = status;

      const response = await adminStudentService.getStudents(params);
      const studentList = response?.students || response?.data || [];

      setStudents(Array.isArray(studentList) ? studentList : []);
      setPagination(response?.pagination || null);
    } catch (err) {
      console.error("Load students error:", err);
      setStudents([]);
      setPagination(null);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, status, submittedSearch]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  };

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setSubmittedSearch("");
    setPage(1);
  };

  const totalStudents =
    pagination?.total ??
    pagination?.totalStudents ??
    pagination?.totalItems ??
    null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300">
              <GraduationCap className="h-4 w-4" />
              Admin workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Students
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Manage registered students, review their profiles, and keep track of account activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadStudents}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh list
          </button>
        </motion.section>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "Students on this page",
              value: students.length,
              icon: Users,
              iconStyle: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
            },
            {
              label: "Current status filter",
              value: tabs.find((tab) => tab.value === status)?.label || "All students",
              icon: SlidersHorizontal,
              iconStyle: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
            },
            {
              label: "Total registered",
              value: totalStudents ?? (pagination?.pages ? `Page ${pagination.page || page} of ${pagination.pages}` : "—"),
              icon: GraduationCap,
              iconStyle: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Search and filters</h2>
            </div>
            <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, or phone..."
                  aria-label="Search students by name, email, or phone"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="h-4 w-4" />
                Search students
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-4 sm:px-5">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Account status
            </span>
            {tabs.map((tab) => {
              const active = status === tab.value;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => changeStatus(tab.value)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold">Unable to load students</p>
              <p className="mt-1 opacity-90">{error}</p>
            </div>
            <button
              type="button"
              onClick={loadStudents}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 font-semibold transition hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-950"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60">
              <RefreshCw className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Loading students</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Please wait while we fetch the latest records.</p>
          </div>
        ) : students.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Users className="h-6 w-6 text-slate-400" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No students found</h2>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {submittedSearch || status
                ? "Try a different search term or change the account status filter."
                : "Student records will appear here when they are available."}
            </p>
            {(submittedSearch || status) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSubmittedSearch("");
                  setStatus("");
                  setPage(1);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onView={(id) => navigate(`/admin/students/${id}`)}
              />
            ))}
          </motion.div>
        )}

        {!loading && pagination && pagination.pages > 1 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing page <span className="font-bold text-slate-800 dark:text-white">{pagination.page || page}</span> of{" "}
              <span className="font-bold text-slate-800 dark:text-white">{pagination.pages}</span>
              {totalStudents != null && (
                <> · <span className="font-semibold text-slate-700 dark:text-slate-300">{totalStudents}</span> students total</>
              )}
            </p>
            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex-none"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
