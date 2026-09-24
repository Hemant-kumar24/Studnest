import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPaymentService from "../../services/adminPaymentService";
import PaymentStatusBadge from "../../components/admin/PaymentStatusBadge";

export default function AdminPaymentDetails() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminPaymentService.getPaymentById(id)
      .then((res) => setPayment(res.data || res.payment || res))
      .catch((err) => setError(err.response?.data?.message || "Unable to load payment."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading payment...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!payment) return <div className="p-6">Payment not found.</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Details</h1>
        <p className="text-sm text-gray-500">{payment._id}</p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <PaymentStatusBadge status={payment.status || payment.paymentStatus} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Amount" value={`₹${Number(payment.amount || 0).toLocaleString("en-IN")}`} />
          <Field label="Currency" value={payment.currency || "INR"} />
          <Field label="Booking ID" value={payment.bookingId?._id || payment.bookingId || "—"} />
          <Field label="Student" value={payment.userId?.name || payment.user?.name || "—"} />
          <Field label="Razorpay Order ID" value={payment.razorpayOrderId || "—"} />
          <Field label="Razorpay Payment ID" value={payment.razorpayPaymentId || "—"} />
          <Field label="Receipt" value={payment.receipt || "—"} />
          <Field label="Created At" value={payment.createdAt ? new Date(payment.createdAt).toLocaleString("en-IN") : "—"} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 break-all font-medium">{value}</p>
    </div>
  );
}
