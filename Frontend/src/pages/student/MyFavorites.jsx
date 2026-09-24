
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaStar,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

import {
  getMyFavorites,
  removeFavorite,
} from "../../services/favoriteService";

import { getApiErrorMessage } from "../../utils/apiError";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const response = await getMyFavorites();

        const data =
          response.data?.data ||
          response.data?.favorites ||
          [];

        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const remove = async (hostelId) => {
    try {
      setRemovingId(hostelId);

      await removeFavorite(hostelId);

      setFavorites((items) =>
        items.filter(
          (item) =>
            (item.hostelId || item.hostel || item)?._id !==
            hostelId
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setRemovingId("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-56 bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-10 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Student Panel
          </p>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            My Favorites
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Keep your shortlisted hostels in one place.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && favorites.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
              <FaHeart className="text-3xl text-pink-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              No favorite hostels yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
              Save hostels while exploring so you can compare
              them later.
            </p>

            <Link
              to="/student/hostels"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Hostels
              <FaArrowRight />
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <>
            <div className="mb-6 flex items-center gap-2">
              <FaHeart className="text-pink-500" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {favorites.length} Saved Hostel
                {favorites.length > 1 ? "s" : ""}
              </span>
            </div>

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {favorites.map((item) => {
                const hostel =
                  item.hostelId ||
                  item.hostel ||
                  item;

                if (!hostel?._id) return null;

                const image =
                  hostel.images?.[0]?.url ||
                  hostel.images?.[0] ||
                  hostel.image ||
                  "https://via.placeholder.com/600x400?text=StudNest";

                return (
                  <article
                    key={item._id || hostel._id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={image}
                        alt={hostel.propertyTitle || "Hostel"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                        <FaHeart className="text-pink-500" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                        {hostel.propertyTitle || "Hostel"}
                      </h2>

                      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <FaMapMarkerAlt className="text-indigo-500" />
                        <span>
                          {hostel.address}, {hostel.city}
                        </span>
                      </div>

                      <div className="mb-5 flex items-center gap-2">
                        <FaStar className="text-yellow-400" />

                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {hostel.rating
                            ? Number(
                                hostel.rating
                              ).toFixed(1)
                            : "New"}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/student/hostels/${hostel._id}`}
                          className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                          View Hostel
                        </Link>

                        <button
                          type="button"
                          disabled={
                            removingId === hostel._id
                          }
                          onClick={() =>
                            remove(hostel._id)
                          }
                          className="flex items-center justify-center rounded-xl border border-red-200 px-4 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          {removingId === hostel._id ? (
                            "..."
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
