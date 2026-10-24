import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CreditCard,
  IndianRupee,
  Search,
  RefreshCw,
  ReceiptText,
  Wallet,
  Clock3,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  X,
} from "lucide-react";
import adminPaymentService from "../../services/adminPaymentService";
import PaymentCard from "../../components/admin/PaymentCard";

const tabs = ["All", "Successful", "Pending", "Failed", "Refunded"];

export default function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10 };
      if (status !== "All") params.status = status;
      if (submittedSearch.trim()) params.search = submittedSearch.trim();

      const [paymentRes, summaryRes] = await Promise.all([
        adminPaymentService.getPayments(params),
        adminPaymentService.getRevenueSummary(),
      ]);

      const paymentData = paymentRes?.data ?? paymentRes?.payments ?? paymentRes;
      const paymentList = Array.isArray(paymentData)
        ? paymentData
        : paymentData?.payments || paymentData?.data || [];

      setPayments(Array.isArray(paymentList) ? paymentList : []);
      const summaryData = summaryRes?.data ?? summaryRes?.summary ?? summaryRes;
      setSummary(summaryData && typeof summaryData === "object" ? summaryData : {});
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load payments.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [page, status, submittedSearch, refreshKey]);

  useEffect(() => {
    load();
  }, [load]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  };

  const clearSearch = () => {
    setSearch("");
    setSubmittedSearch("");
    setPage(1);
  };

  const selectStatus = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const openDetails = (id) => {
    navigate(`/admin/payments/${id}`);
  };

  const retryLoad = () => setRefreshKey((value) => value + 1);

  const statItems = [
    {
      title: "Total Transactions",
      value: summary.totalTransactions ?? 0,
      icon: <ReceiptText className="h-5 w-5" />,
      tone: "blue",
    },
    {
      title: "Successful Revenue",
      value: `₹${Number(
        summary.totalRevenue ?? summary.successfulRevenue ?? 0
      ).toLocaleString("en-IN")}`,
      icon: <IndianRupee className="h-5 w-5" />,
      tone: "emerald",
    },
    {
      title: "Pending Transactions",
      value: summary.pendingTransactions ?? 0,
      icon: <Clock3 className="h-5 w-5" />,
      tone: "amber",
    },
    {
      title: "Refunded Amount",
      value: `₹${Number(summary.refundedAmount ?? 0).toLocaleString("en-IN")}`,
      icon: <RotateCcw className="h-5 w-5" />,
      tone: "violet",
    },
  ];

  return (
    <main className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:p-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <Wallet className="h-4 w-4" />
            Finance overview
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Payments &amp; Revenue
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Monitor booking transactions and platform revenue.
          </p>
        </div>

        <button
          type="button"
          onClick={retryLoad}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  {item.title}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {item.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${toneClasses[item.tone]}`}>
                {item.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold">Transaction history</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Filter transactions by payment status or search for a record.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by payment status">
            {tabs.map((tab) => {
              const active = status === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => selectStatus(tab)}
                  aria-pressed={active}
                  className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={submitSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search payment ID, booking ID, receipt..."
              aria-label="Search payments"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {(submittedSearch || status !== "All") && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <span>Active filters:</span>
            {status !== "All" && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {status}
              </span>
            )}
            {submittedSearch && (
              <span className="max-w-full break-all rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                Search: {submittedSearch}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setStatus("All");
                clearSearch();
              }}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Could not load transactions</p>
            <p className="mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={retryLoad}
            className="shrink-0 font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3" aria-label="Loading payments">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-slate-800" />
                  <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
            <CreditCard className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No transactions found</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-slate-400">
            Try changing the status filter or search terms to find a payment.
          </p>
          {(submittedSearch || status !== "All") && (
            <button
              type="button"
              onClick={() => {
                setStatus("All");
                clearSearch();
              }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1 text-sm text-gray-500 dark:text-slate-400">
            <span>Showing {payments.length} transaction{payments.length === 1 ? "" : "s"}</span>
            <span>Page {page}</span>
          </div>
          {payments.map((payment) => (
            <PaymentCard
              key={payment._id}
              payment={payment}
              onView={openDetails}
            />
          ))}
        </section>
      )}

      <footer className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Page <span className="font-semibold text-gray-800 dark:text-slate-100">{page}</span>
          {" "}of transaction results
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={payments.length < 10 || loading}
            onClick={() => setPage((current) => current + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Next
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
};
