import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";

import { getBookingById } from "../../services/bookingService";
import {
  createBookingOrder,
  verifyBookingPayment,
} from "../../services/paymentService";
import { loadRazorpay } from "../../utils/loadRazorpay";
import { getApiErrorMessage } from "../../utils/apiError";
import { useAuth } from "../../context/AuthContext";

export default function BookingPayment() {
  const { id } = useParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBookingById(id);

        setBooking(
          response.data?.data ||
            response.data?.booking
        );
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  const payNow = async () => {
    try {
      if (!booking?._id) {
        throw new Error("Booking information is missing");
      }

      setPaying(true);
      setError("");

      // Load Razorpay SDK
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error(
          "Razorpay checkout could not be loaded"
        );
      }

      // Create Razorpay order
      const orderResponse = await createBookingOrder({
        bookingId: booking._id,
      });

      const order =
        orderResponse.data?.data ||
        orderResponse.data?.order;

      if (!order?.id) {
        throw new Error(
          "Payment order was not created"
        );
      }

      const options = {
        key:
          order.key ||
          import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "StudNest",

        description: `Booking ${booking._id}`,

        order_id: order.id,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        handler: async (paymentResponse) => {
          try {
            setPaying(true);
            setError("");

            // Verify payment on backend
            await verifyBookingPayment({
              bookingId: booking._id,

              razorpay_order_id:
                paymentResponse.razorpay_order_id,

              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,

              razorpay_signature:
                paymentResponse.razorpay_signature,
            });

            setSuccess(true);
          } catch (err) {
            setError(
              getApiErrorMessage(err)
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      setError(
        getApiErrorMessage(err)
      );

      setPaying(false);
    }
  };

  /* Loading */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-8 h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
            <div className="h-32 bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-5 p-8">
              <div className="h-7 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

              <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />

              <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />

              <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* Payment Success */
  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl dark:border-emerald-900 dark:bg-slate-900 sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <FaCheckCircle className="text-5xl text-emerald-500" />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Payment Completed
          </p>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Payment Successful 🎉
          </h1>

          <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
            Your payment has been verified successfully
            and your booking is confirmed.
          </p>

          <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left dark:bg-slate-800/60">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Amount Paid
              </span>

              <strong className="text-xl text-emerald-600 dark:text-emerald-400">
                ₹
                {Number(
                  booking?.amount || 0
                ).toLocaleString()}
              </strong>
            </div>
          </div>

          <Link
            to={`/student/bookings/${booking?._id}`}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            View Booking
          </Link>

          <Link
            to="/student/bookings"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <FaArrowLeft />
            Back to all bookings
          </Link>
        </div>
      </main>
    );
  }

  /* Booking Not Found */
  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-900 dark:bg-slate-900">
          <FaCreditCard className="mx-auto mb-4 text-5xl text-red-400" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Unable to load payment
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error || "Booking not found"}
          </p>

          <Link
            to="/student/bookings"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FaArrowLeft />
            Back to bookings
          </Link>
        </div>
      </main>
    );
  }

  const isPaid =
    booking.paymentStatus === "Paid";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto max-w-4xl">

        <Link
          to={`/student/bookings/${booking._id}`}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <FaArrowLeft />
          Back to booking
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
            <FaCreditCard className="text-2xl text-indigo-600 dark:text-indigo-400" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Secure Payment
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Complete Your Payment
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Securely pay for your StudNest booking
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 flex max-w-2xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaCreditCard className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-[1fr_0.8fr]">

          {/* Booking Card */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white sm:px-8">
              <p className="text-sm font-medium text-indigo-100">
                Booking Summary
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {booking.hostelId?.propertyTitle ||
                  "StudNest Hostel"}
              </h2>

              {booking.hostelId?.city && (
                <p className="mt-2 flex items-center gap-2 text-sm text-indigo-100">
                  <FaMapMarkerAlt />
                  {booking.hostelId.city}
                </p>
              )}
            </div>

            <div className="space-y-5 p-6 sm:p-8">

              <DetailRow
                icon={<FaBed />}
                label="Room"
                value={
                  booking.roomId?.roomNumber
                    ? `Room ${booking.roomId.roomNumber}`
                    : booking.roomType || "-"
                }
              />

              <DetailRow
                icon={<FaCalendarAlt />}
                label="Duration"
                value={`${booking.duration || "-"} month(s)`}
              />

              <DetailRow
                icon={<FaCalendarAlt />}
                label="Start Date"
                value={
                  booking.startDate
                    ? new Date(
                        booking.startDate
                      ).toLocaleDateString()
                    : "-"
                }
              />

              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                      ₹
                      {Number(
                        booking.amount || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  {isPaid && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <FaCheckCircle />
                      Paid
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Payment Card */}
          <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

            <div className="flex-1">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <FaShieldAlt className="text-xl text-emerald-600 dark:text-emerald-400" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Secure Checkout
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                You'll be redirected to Razorpay's secure checkout
                to complete your payment.
              </p>

              <div className="mt-6 space-y-3">
                <SecurityPoint text="Secure payment processing" />
                <SecurityPoint text="Multiple payment methods" />
                <SecurityPoint text="Payment verification by StudNest" />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={payNow}
                disabled={paying || isPaid}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Opening Payment...
                  </>
                ) : isPaid ? (
                  <>
                    <FaCheckCircle />
                    Already Paid
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Pay with Razorpay
                  </>
                )}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <FaLock />
                Your payment is securely encrypted
              </p>
            </div>
          </section>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-slate-400">
          <FaLock />
          <span>
            Never share your payment credentials or OTP with anyone.
          </span>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
          {icon}
        </div>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>

      <span className="text-right text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function SecurityPoint({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <FaCheckCircle className="shrink-0 text-emerald-500" />
      {text}
    </div>
  );
}