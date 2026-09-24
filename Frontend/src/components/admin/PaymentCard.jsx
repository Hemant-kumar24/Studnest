import PaymentStatusBadge from "./PaymentStatusBadge";

export default function PaymentCard({ payment, onView }) {
  const amount = Number(payment.amount || 0);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{payment.receipt || payment._id}</p>
          <p className="text-sm text-gray-500">
            {payment.userId?.name || payment.user?.name || "Student"}
          </p>
        </div>
        <PaymentStatusBadge status={payment.status || payment.paymentStatus} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><span className="text-gray-500">Amount</span><p className="font-semibold">₹{amount.toLocaleString("en-IN")}</p></div>
        <div><span className="text-gray-500">Booking</span><p>{payment.bookingId?._id || payment.bookingId || "—"}</p></div>
        <div><span className="text-gray-500">Razorpay ID</span><p className="break-all">{payment.razorpayPaymentId || "—"}</p></div>
        <div><span className="text-gray-500">Date</span><p>{payment.createdAt ? new Date(payment.createdAt).toLocaleString("en-IN") : "—"}</p></div>
      </div>

      <button
        onClick={() => onView(payment._id)}
        className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        View Details
      </button>
    </div>
  );
}
