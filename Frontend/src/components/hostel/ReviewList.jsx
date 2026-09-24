export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-xl dark:bg-amber-900/20">
          ⭐
        </div>

        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
          No reviews yet
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Be the first to review after your stay.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const rating = Math.min(5, Math.max(0, Number(review.rating || 0)));

        return (
          <article
            key={review._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                  {(review.userId?.name || "S").charAt(0).toUpperCase()}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {review.userId?.name || "Student"}
                  </h4>

                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-sm">
                      {"⭐".repeat(rating)}
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      {rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {review.createdAt && (
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {review.comment && (
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {review.comment}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}