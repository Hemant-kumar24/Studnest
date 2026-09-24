import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminReview(id);

        setReview(
          response.data?.data ||
            response.data?.review ||
            null
        );
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const remove = async () => {
    if (!window.confirm("Delete this review permanently?")) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteAdminReview(id);

      navigate("/admin/reviews");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Loading review...
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            {error || "Review not found."}
          </p>

          <Link
            to="/admin/reviews"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Reviews
          </Link>
        </div>
      </main>
    );
  }

  const student =
    review.userId ||
    review.user ||
    review.student ||
    {};

  const hostel =
    review.hostelId ||
    review.hostel ||
    {};

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <section className="mb-6">
          <Link
            to="/admin/reviews"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <span>←</span>
            Back to Reviews
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Review Details
            </p>

            <h1 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
              {hostel.propertyTitle || "Hostel Review"}
            </h1>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <i className="fas fa-circle-exclamation mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Review Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Student */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <i className="fas fa-user" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Student
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Name"
                value={student.name || "-"}
              />

              <DetailItem
                label="Email"
                value={student.email || "-"}
              />
            </div>
          </div>

          {/* Rating */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <i className="fas fa-star" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Rating
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <RatingStars rating={review.rating} />

              <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                {review.rating}/5
              </span>
            </div>
          </div>

          {/* Review */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <i className="fas fa-comment" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Review
              </h2>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {review.comment ||
                  review.reviewText ||
                  review.text ||
                  "-"}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <i className="fas fa-calendar" />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Date
              </h2>
            </div>

            <p className="text-sm font-medium text-slate-700">
              {review.createdAt
                ? new Date(
                    review.createdAt
                  ).toLocaleString()
                : "-"}
            </p>
          </div>
        </section>

        {/* Delete Action */}
        <section className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-red-800">
                Delete Review
              </h2>

              <p className="mt-1 text-sm text-red-600">
                This action will permanently remove this review.
              </p>
            </div>

            <button
              type="button"
              disabled={deleting}
              onClick={remove}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {deleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash text-xs" />
                  Delete Review
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}