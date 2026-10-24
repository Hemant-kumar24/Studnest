import React from "react";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function PaymentCard({ payment, onView }) {
  const amount = Number(payment.amount || 0);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 sm:p-5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all font-semibold text-slate-900 dark:text-slate-100">
            {payment.receipt || payment._id}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {payment.userId?.name || payment.user?.name || "Student"}
          </p>
        </div>
        <PaymentStatusBadge
          status={payment.status || payment.paymentStatus}
        />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Amount
          </span>
          <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
            ₹{amount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Booking
          </span>
          <p className="mt-1 break-all text-slate-800 dark:text-slate-200">
            {payment.bookingId?._id || payment.bookingId || "—"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Razorpay ID
          </span>
          <p className="mt-1 break-all text-slate-800 dark:text-slate-200">
            {payment.razorpayPaymentId || "—"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Date
          </span>
          <p className="mt-1 break-words text-slate-800 dark:text-slate-200">
            {payment.createdAt
              ? new Date(payment.createdAt).toLocaleString("en-IN")
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onView(payment._id)}
          className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-indigo-400/30 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-400/10"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
