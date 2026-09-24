import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaCrosshairs,
  FaMapMarkerAlt,
  FaRedo,
  FaRupeeSign,
  FaSearchLocation,
  FaSpinner,
} from "react-icons/fa";

import {
  getMyLocation,
  getNearbyHostels,
} from "../../services/locationService";

import LocationButton from "../../components/student/LocationButton";
import { getApiErrorMessage } from "../../utils/apiError";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=StudNest";

export default function NearbyHostels() {
  const [hostels, setHostels] = useState([]);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  // ============================================
  // LOAD NEARBY HOSTELS
  // ============================================

  const loadNearby = async (currentRadius = radius) => {
    try {
      setLoading(true);
      setError("");

      // Get saved student location
      const locationResponse = await getMyLocation();

      const savedLocation =
        locationResponse?.location || null;

      setLocation(savedLocation);

      // Get nearby hostels
      const response = await getNearbyHostels({
        radius: currentRadius,
        limit: 20,
      });

      setHostels(
        Array.isArray(response?.hostels)
          ? response.hostels
          : []
      );
    } catch (err) {
      console.error("Nearby hostels error:", err);

      setError(getApiErrorMessage(err));
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    loadNearby(10);
  }, []);

  // ============================================
  // LOCATION SAVED
  // ============================================

  const locationSaved = async () => {
    await loadNearby(radius);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <section className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <FaSearchLocation />
            Discovery
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Hostels Near Me
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            Find approved student accommodation around your
            current location.
          </p>
        </section>

        {/* ======================================
            CONTROLS
        ====================================== */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            {/* LOCATION */}

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Your Location
              </p>

              <LocationButton
                onSaved={locationSaved}
              />
            </div>

            {/* RADIUS */}

            <div className="w-full md:w-64">
              <label
                htmlFor="radius"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Search Radius
              </label>

              <div className="relative">
                <FaCrosshairs className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />

                <select
                  id="radius"
                  value={radius}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value
                    );

                    setRadius(value);
                    loadNearby(value);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value={2}>
                    Within 2 km
                  </option>

                  <option value={5}>
                    Within 5 km
                  </option>

                  <option value={10}>
                    Within 10 km
                  </option>

                  <option value={20}>
                    Within 20 km
                  </option>

                  <option value={50}>
                    Within 50 km
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================
            LOCATION STATUS
        ====================================== */}

        {location?.coordinates?.length === 2 && (
          <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-900 dark:bg-emerald-950/20">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Location ready
                </p>

                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Searching within {radius} km
                </p>
              </div>
            </div>

            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {hostels.length} hostel
              {hostels.length !== 1
                ? "s"
                : ""}{" "}
              found
            </span>
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <>
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">

              <FaSpinner className="animate-spin text-indigo-600" />

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Finding nearby hostels...
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <HostelSkeleton key={index} />
                )
              )}
            </div>
          </>
        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <FaMapMarkerAlt className="text-xl text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Unable to find nearby hostels
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadNearby(radius)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FaRedo />
              Try Again
            </button>
          </div>
        )}

        {/* ======================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          hostels.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                <FaSearchLocation className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No hostels found nearby
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Try increasing the search radius to
                discover more hostels around you.
              </p>

              <button
                type="button"
                onClick={() => {
                  const nextRadius =
                    radius < 50
                      ? Math.min(radius * 2, 50)
                      : 50;

                  setRadius(nextRadius);
                  loadNearby(nextRadius);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Increase Radius
                <FaArrowRight />
              </button>
            </div>
          )}

        {/* ======================================
            HOSTEL GRID
        ====================================== */}

        {!loading &&
          !error &&
          hostels.length > 0 && (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {hostels.map((hostel) => {

                const image =
                  hostel.images?.[0]?.url ||
                  hostel.images?.[0] ||
                  hostel.image ||
                  FALLBACK_IMAGE;

                return (
                  <article
                    key={hostel._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >

                    {/* IMAGE */}

                    <div className="relative h-52 overflow-hidden">

                      <img
                        src={image}
                        alt={
                          hostel.propertyTitle ||
                          "Hostel"
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                      />

                      {/* DISTANCE */}

                      {hostel.distanceKm != null && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                          {Number(
                            hostel.distanceKm
                          ).toFixed(1)}{" "}
                          km
                        </span>
                      )}

                      {/* PROPERTY TYPE */}

                      {hostel.propertyType && (
                        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                          {hostel.propertyType}
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                        {hostel.propertyTitle ||
                          "Hostel"}
                      </h2>

                      <p className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">

                        <FaMapMarkerAlt className="mt-0.5 shrink-0 text-indigo-500" />

                        <span className="line-clamp-2">
                          {hostel.address
                            ? `${hostel.address}, `
                            : ""}

                          {hostel.city ||
                            "Location unavailable"}
                        </span>
                      </p>

                      {/* RATING */}

                      <div className="mt-3 flex items-center gap-2">

                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          ★{" "}
                          {Number(
                            hostel.rating || 0
                          ).toFixed(1)}
                        </span>

                        <span className="text-xs text-slate-400">
                          ({hostel.reviewCount || 0} reviews)
                        </span>
                      </div>

                      <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                      {/* PRICE */}

                      <div className="flex items-center justify-between gap-3">

                        <div>
                          <p className="text-xs text-slate-400">
                            Starting from
                          </p>

                          <p className="mt-1 flex items-center text-lg font-bold text-slate-900 dark:text-white">

                            <FaRupeeSign className="text-sm" />

                            {Number(
                              hostel.monthlyRent ||
                                hostel.minRent ||
                                hostel.rent ||
                                0
                            ).toLocaleString()}

                            <span className="ml-1 text-xs font-normal text-slate-400">
                              /month
                            </span>

                          </p>
                        </div>

                        {/* VIEW */}

                        <Link
                          to={`/student/hostels/${hostel._id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700"
                          aria-label="View hostel"
                        >
                          <FaArrowRight className="text-sm transition-transform group-hover:translate-x-0.5" />
                        </Link>

                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
      </div>
    </main>
  );
}

// ============================================
// SKELETON
// ============================================

function HostelSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

      <div className="h-52 bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-4 p-5">

        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />

        <div className="flex justify-between pt-2">

          <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />

        </div>
      </div>
    </div>
  );
}