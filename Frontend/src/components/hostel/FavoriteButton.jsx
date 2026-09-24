import { useEffect, useState } from "react";
import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from "../../services/favoriteService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function FavoriteButton({ hostelId }) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hostelId) return;

    setLoading(true);

    checkFavorite(hostelId)
      .then((r) => {
        const d = r.data?.data;

        setFavorite(
          Boolean(
            typeof d === "boolean"
              ? d
              : d?.isFavorite ?? r.data?.isFavorite
          )
        );
      })
      .catch(() => setFavorite(false))
      .finally(() => setLoading(false));
  }, [hostelId]);

  const toggle = async () => {
    if (!hostelId) return;

    try {
      setLoading(true);
      setError("");

      if (favorite) {
        await removeFavorite(hostelId);
        setFavorite(false);
      } else {
        await addFavorite(hostelId);
        setFavorite(true);
      }
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={toggle}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
          loading
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : favorite
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        }`}
      >
        <span className="text-lg leading-none">
          {favorite ? "♥" : "♡"}
        </span>

        {loading ? "Loading..." : favorite ? "Saved" : "Favorite"}
      </button>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}