import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  ReceiptText,
  CalendarClock,
  UserRound,
  Hash,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Copy,
} from "lucide-react";
import adminPaymentService from "../../services/adminPaymentService";
import PaymentStatusBadge from "../../components/admin/PaymentStatusBadge";

export default function AdminPaymentDetails() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    adminPaymentService
      .getPaymentById(id)
      .then((res) => {
        if (active) setPayment(res?.data || res?.payment || res);
      })
      .catch((err) => {
        if (active) {
          setError(
            err?.response?.data?.message || "Unable to load payment details."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, retryKey]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-8 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-4 w-28 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-8 w-56 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-48 rounded-2xl bg-gray-200 dark:bg-slate-800" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-10 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold">Unable to load payment</h1>
              <p className="mt-1 break-words text-sm text-gray-600 dark:text-slate-300">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRetryKey((key) => key + 1)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!payment) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-10 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CreditCard className="mx-auto h-10 w-10 text-gray-400 dark:text-slate-500" />
          <h1 className="mt-3 text-xl font-semibold">Payment not found</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            We couldn't find a payment record for this ID.
          </p>
          <BackLink />
        </div>
      </main>
    );
  }

  const paymentStatus = payment.status || payment.paymentStatus;
  const bookingId =
    typeof payment.bookingId === "object"
      ? payment.bookingId?._id
      : payment.bookingId;
  const studentName = payment.userId?.name || payment.user?.name || "—";
  const createdAt = payment.createdAt
    ? new Date(payment.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/admin/payments"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <CreditCard className="h-4 w-4" />
              Payment management
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Payment Details
            </h1>
            <p className="mt-2 break-all text-sm text-gray-500 dark:text-slate-400">
              Transaction ID: {payment._id || id}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Payment status
              </p>
              <div className="mt-1">
                <PaymentStatusBadge status={paymentStatus} />
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Transaction overview</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Amount, booking and gateway information
              </p>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            <Field
              icon={<IndianRupee className="h-4 w-4" />}
              label="Amount"
              value={`₹${Number(payment.amount || 0).toLocaleString("en-IN")}`}
              highlight
            />
            <Field
              icon={<ReceiptText className="h-4 w-4" />}
              label="Currency"
              value={payment.currency || "INR"}
            />
            <Field
              icon={<Hash className="h-4 w-4" />}
              label="Booking ID"
              value={bookingId || "—"}
              copyable={Boolean(bookingId)}
            />
            <Field
              icon={<UserRound className="h-4 w-4" />}
              label="Student"
              value={studentName}
            />
            <Field
              icon={<Hash className="h-4 w-4" />}
              label="Razorpay Order ID"
              value={payment.razorpayOrderId || "—"}
              copyable={Boolean(payment.razorpayOrderId)}
            />
            <Field
              icon={<Hash className="h-4 w-4" />}
              label="Razorpay Payment ID"
              value={payment.razorpayPaymentId || "—"}
              copyable={Boolean(payment.razorpayPaymentId)}
            />
            <Field
              icon={<ReceiptText className="h-4 w-4" />}
              label="Receipt"
              value={payment.receipt || "—"}
            />
            <Field
              icon={<CalendarClock className="h-4 w-4" />}
              label="Created at"
              value={createdAt}
            />
          </div>
        </motion.section>

        <div className="flex justify-end">
          <BackLink />
        </div>
      </div>
    </main>
  );
}

function Field({ icon, label, value, highlight = false, copyable = false }) {
  const copyValue = async () => {
    if (!copyable || !value || value === "—") return;
    try {
      await navigator.clipboard.writeText(String(value));
    } catch {
      // Clipboard may be unavailable in insecure contexts.
    }
  };

  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
        <span className="text-gray-400 dark:text-slate-500">{icon}</span>
        {label}
      </p>
      <div className="mt-2 flex items-start gap-2">
        <p
          className={`min-w-0 break-all font-medium ${
            highlight
              ? "text-xl font-bold text-blue-700 dark:text-blue-300"
              : "text-sm text-gray-800 dark:text-slate-100"
          }`}
        >
          {value}
        </p>
        {copyable && value && value !== "—" && (
          <button
            type="button"
            onClick={copyValue}
            title={`Copy ${label}`}
            aria-label={`Copy ${label}`}
            className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/admin/payments"
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Payments
    </Link>
  );
}
