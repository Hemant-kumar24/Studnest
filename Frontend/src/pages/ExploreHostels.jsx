
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaStar,
  FaUser,
  FaMapMarkerAlt,
  FaHeart,
  FaSearch,
  FaRedo,
  FaBed,
  FaRupeeSign,
} from "react-icons/fa";
import toast from "react-hot-toast";

import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const getHostelsFromResponse = (response) => {
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.hostels)) return body.hostels;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.hostels)) return body.data.hostels;

  return null;
};

const getFavoritesFromResponse = (response) => {
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.favorites)) return body.favorites;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.favorites)) return body.data.favorites;
  if (Array.isArray(body?.data?.data)) return body.data.data;

  return [];
};

const getFavoriteHostelId = (favorite) => {
  const hostel =
    favorite?.hostelId ?? favorite?.hostel ?? favorite?.hostel_id;

  if (typeof hostel === "string") return hostel;
  if (typeof hostel === "object" && hostel !== null) {
    return String(hostel._id ?? hostel.id ?? "");
  }

  return String(favorite?.hostelId?._id ?? "");
};

const getErrorMessage = (error) => {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  if (!error?.response) {
    return "Cannot connect to the server. Check your API URL and backend status.";
  }

  if (status === 404) {
    return "The hostel API endpoint was not found. Check your backend routes.";
  }

  if (status === 401 || status === 403) {
    return "You do not have permission to access this resource.";
  }

  return message || "Unable to load hostels. Please try again.";
};

const getUniqueOptions = (items, field) => {
  return [
    ...new Set(
      items
        .map((item) => item?.[field])
        .filter((value) => typeof value === "string" && value.trim())
        .map((value) => value.trim())
    ),
  ].sort((a, b) => a.localeCompare(b));
};

const ExploreHostels = () => {
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState([]);

  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  const loadHostels = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Expected endpoint: GET /api/hostels
      const response = await axiosInstance.get("/hostels");
      const list = getHostelsFromResponse(response);

      if (!list) {
        console.error("Unexpected hostel API response:", response.data);
        throw new Error(
          "The hostel API returned an unexpected response format."
        );
      }

      setHostels(list);
    } catch (err) {
      console.error("Failed to load hostels:", err);
      setHostels([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!isLoggedIn()) {
      setSavedIds([]);
      return;
    }

    try {
      // Expected endpoint: GET /api/user/favorites
      const response = await axiosInstance.get("/user/favorites");
      const favorites = getFavoritesFromResponse(response);

      setSavedIds(
        favorites
          .map(getFavoriteHostelId)
          .filter(Boolean)
          .map(String)
      );
    } catch (err) {
      console.error("Failed to load favorites:", err);
      // Keep hostel browsing available even if favorites cannot load.
    }
  }, []);

  useEffect(() => {
    loadHostels();
    loadFavorites();
  }, [loadHostels, loadFavorites]);

  const cities = useMemo(
    () => getUniqueOptions(hostels, "city"),
    [hostels]
  );

  const colleges = useMemo(
    () => getUniqueOptions(hostels, "nearbyCollege"),
    [hostels]
  );

  const filteredHostels = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedCity = city.trim().toLowerCase();
    const normalizedCollege = college.trim().toLowerCase();

    return hostels.filter((hostel) => {
      const title = String(hostel.propertyTitle || "").toLowerCase();
      const hostelCity = String(hostel.city || "").toLowerCase();
      const nearbyCollege = String(hostel.nearbyCollege || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch || title.includes(normalizedSearch);

      const matchesCity =
        !normalizedCity || hostelCity === normalizedCity;

      const matchesCollege =
        !normalizedCollege || nearbyCollege === normalizedCollege;

      return matchesSearch && matchesCity && matchesCollege;
    });
  }, [hostels, search, city, college]);

  const resetFilters = () => {
    setSearch("");
    setCity("");
    setCollege("");
  };

  const toggleFavorite = async (hostelId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to save your favorite hostels.");
      navigate("/user/login");
      return;
    }

    if (favoriteLoadingIds.includes(hostelId)) return;

    const alreadySaved = savedIds.includes(hostelId);

    setFavoriteLoadingIds((current) => [...current, hostelId]);

    try {
      if (alreadySaved) {
        // Expected endpoint: DELETE /api/user/favorites/:hostelId
        await axiosInstance.delete(`/user/favorites/${hostelId}`);

        setSavedIds((current) =>
          current.filter((id) => id !== hostelId)
        );

        toast.success("Removed from favorites");
      } else {
        // Expected endpoint: POST /api/user/favorites
        await axiosInstance.post("/user/favorites", { hostelId });

        setSavedIds((current) =>
          current.includes(hostelId) ? current : [...current, hostelId]
        );

        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Favorite action failed:", err);
      toast.error(
        err?.response?.data?.message ||
          "Unable to update favorites. Please try again."
      );
    } finally {
      setFavoriteLoadingIds((current) =>
        current.filter((id) => id !== hostelId)
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 dark:bg-gray-950">
          <LoadingSpinner
            size="large"
            color="purple"
            text="Loading hostels..."
            fullScreen={false}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 pb-20 pt-10 text-gray-900 sm:px-6 md:px-10 md:pt-14 dark:bg-gray-950 dark:text-white">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              Find your next stay
            </p>

            <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
              Explore{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Hostels & PGs
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-400">
              Search available accommodation options, compare details,
              and find a place that suits your college life.
            </p>
          </div>

          {/* Filters */}
          <section
            aria-label="Filter hostel listings"
            className="mb-10 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <FaSearch className="text-purple-500" />
              Find accommodation
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
              <input
                type="search"
                aria-label="Search by hostel name"
                placeholder="Search by hostel name..."
                className="min-h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                aria-label="Filter by city"
                className="min-h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-950"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by college"
                className="min-h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-gray-700 dark:bg-gray-950"
                value={college}
                onChange={(event) => setCollege(event.target.value)}
              >
                <option value="">All Colleges</option>
                {colleges.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <FaRedo size={12} />
                Reset
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredHostels.length} of {hostels.length} listings
            </p>
          </section>

          {/* API error */}
          {error && (
            <div
              role="alert"
              className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30"
            >
              <h2 className="font-bold text-red-700 dark:text-red-300">
                Could not load hostels
              </h2>

              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={loadHostels}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <FaRedo />
                Try again
              </button>
            </div>
          )}

          {/* Hostel cards */}
          {!error && filteredHostels.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHostels.map((hostel, index) => {
                const hostelId = String(hostel._id || hostel.id || "");
                const isSaved = savedIds.includes(hostelId);
                const isFavoriteLoading =
                  favoriteLoadingIds.includes(hostelId);

                const image =
                  hostel.image ||
                  (Array.isArray(hostel.images) ? hostel.images[0] : "") ||
                  "/hostel_background_image.jpeg";

                const amenities = Array.isArray(hostel.amenities)
                  ? hostel.amenities
                  : [];

                return (
                  <motion.article
                    key={hostelId || index}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.04, 0.2),
                    }}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={image}
                        alt={hostel.propertyTitle || "Hostel accommodation"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "/hostel_background_image.jpeg";
                        }}
                        className="h-52 w-full bg-gray-100 object-cover dark:bg-gray-800"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {hostel.propertyType || "Accommodation"}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(hostelId)}
                        disabled={!hostelId || isFavoriteLoading}
                        aria-label={
                          isSaved
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        aria-pressed={isSaved}
                        title={
                          isSaved
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900/95"
                      >
                        <FaHeart
                          className={isSaved ? "text-red-600" : ""}
                          size={17}
                        />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                          {hostel.propertyTitle || "Untitled Hostel"}
                        </h2>

                        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          <FaStar />
                          {hostel.rating != null ? hostel.rating : "N/A"}
                        </div>
                      </div>

                      <p className="mt-3 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt className="mt-1 shrink-0 text-pink-500" />
                        <span>
                          {[hostel.city, hostel.nearbyCollege]
                            .filter(Boolean)
                            .join(" · ") || "Location not provided"}
                        </span>
                      </p>

                      <div className="mt-5 space-y-3 border-y border-gray-100 py-4 text-sm dark:border-gray-800">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <FaBed className="text-indigo-500" />
                            Rooms
                          </span>
                          <span className="text-right font-medium">
                            {hostel.availableRooms != null
                              ? `${hostel.availableRooms} available`
                              : "Availability not listed"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <FaRupeeSign className="text-emerald-500" />
                            Monthly rent
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {hostel.monthlyRent != null
                              ? `₹${Number(hostel.monthlyRent).toLocaleString("en-IN")}`
                              : "Contact for price"}
                          </span>
                        </div>

                        {hostel.securityDeposit != null && (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500 dark:text-gray-400">
                              Security deposit
                            </span>
                            <span className="font-medium">
                              ₹
                              {Number(hostel.securityDeposit).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        )}

                        {hostel.genderPreference && (
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <FaUser className="text-purple-500" />
                              Preference
                            </span>
                            <span className="text-right font-medium">
                              {hostel.genderPreference}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      {amenities.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Amenities
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {amenities.slice(0, 5).map((amenity, amenityIndex) => (
                              <span
                                key={`${amenity}-${amenityIndex}`}
                                className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:from-indigo-950 dark:to-purple-950 dark:text-indigo-300"
                              >
                                {amenity}
                              </span>
                            ))}

                            {amenities.length > 5 && (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                +{amenities.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Update this route if your App.jsx uses another details path. */}
                      <button
                        type="button"
                        onClick={() => navigate(`/hostel/${hostelId}`)}
                        disabled={!hostelId}
                        className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
                      >
                        View Hostel Details
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!error && filteredHostels.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                <FaSearch size={22} />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {hostels.length === 0
                  ? "No hostel listings available yet"
                  : "No matching hostels found"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
                {hostels.length === 0
                  ? "There are currently no listings to display. Please check again later."
                  : "Try a different name, city, or college, or clear your filters."}
              </p>

              {(search || city || college) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ExploreHostels;
