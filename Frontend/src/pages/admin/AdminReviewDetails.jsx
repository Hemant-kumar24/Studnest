import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  MessageSquareText,
  Star,
  UserRound,
  Mail,
  Trash2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Hotel,
} from "lucide-react";
import {
  getAdminReview,
  deleteAdminReview,
} from "../../services/adminReviewService";
import RatingStars from "../../components/admin/RatingStars";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminReviewDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminReview(id);
        const result =
          response?.data?.data ??
          response?.data?.review ??
          response?.data ??
          response?.review ??
          null;

        if (active) setReview(result);
      } catch (err) {
        if (active) setError(getApiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id, retryKey]);

  const remove = async () => {
    if (deleting) return;
    if (!window.confirm("Delete this review permanently? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await deleteAdminReview(id);
      navigate("/admin/reviews", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="mt-3 font-semibold">{error || "Review not found."}</p>
          {error && (
            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          )}
          <div>
            <Link
              to="/admin/reviews"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Reviews
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const student = review.userId || review.user || review.student || {};
  const hostel = review.hostelId || review.hostel || {};
  const studentName =
    typeof student === "object" ? student.name || student.fullName || "—" : "—";
  const studentEmail =
    typeof student === "object" ? student.email || "—" : "—";
  const hostelTitle =
    typeof hostel === "object"
      ? hostel.propertyTitle || hostel.name || hostel.title || "Hostel Review"
      : "Hostel Review";
  const reviewText = review.comment || review.reviewText || review.text || "No written comment provided.";
  const createdAt = review.createdAt
    ? new Date(review.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to="/admin/reviews"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Link>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:p-6"
        >
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <MessageSquareText className="h-4 w-4" />
              Review details
            </p>
            <h1 className="break-words text-xl font-bold tracking-tight sm:text-2xl">
              {hostelTitle}
            </h1>
            <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
              Review ID: {review._id || id}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
            <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
            <div>
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Student rating</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-bold text-amber-900 dark:text-amber-200">
                  {Number(review.rating || 0)}/5
                </span>
                <RatingStars rating={review.rating} />
              </div>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <SectionHeader
              icon={<UserRound className="h-5 w-5" />}
              title="Student information"
              subtitle="Details associated with this review"
              iconTone="blue"
            />
            <div className="space-y-4 p-5 sm:p-6">
              <DetailItem
                icon={<UserRound className="h-4 w-4" />}
                label="Student name"
                value={studentName}
              />
              <DetailItem
                icon={<Mail className="h-4 w-4" />}
                label="Email address"
                value={studentEmail}
              />
              <DetailItem
                icon={<Hotel className="h-4 w-4" />}
                label="Property"
                value={hostelTitle}
              />
              <DetailItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Submitted on"
                value={createdAt}
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <SectionHeader
              icon={<MessageSquareText className="h-5 w-5" />}
              title="Student feedback"
              subtitle="Review comment and rating"
              iconTone="violet"
            />
            <div className="p-5 sm:p-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <MessageSquareText className="h-4 w-4 text-violet-500" />
                  Written review
                </div>
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {reviewText}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Overall rating
                </span>
                <span className="font-bold text-amber-800 dark:text-amber-300">
                  {Number(review.rating || 0)} out of 5
                </span>
              </div>
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="rounded-2xl border border-red-200 bg-white shadow-sm transition-colors dark:border-red-900/50 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-slate-100">Delete review</h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Permanently remove this review from StudNest. This action cannot be undone.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={deleting}
              onClick={remove}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900 sm:w-auto"
            >
              {deleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete review
                </>
              )}
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function SectionHeader({ icon, title, subtitle, iconTone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  };

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[iconTone]}`}>
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}
