import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaUniversity } from "react-icons/fa";
import api from "../utils/axiosInstance";

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const ensureAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/user/login");
      return false;
    }
    return true;
  };

  const handleBookNow = () => {
    if (!ensureAuth()) return;
    navigate(`/user/book/${hostel._id}`);
  };

  const addToFavorites = async () => {
    if (!ensureAuth()) return;
    try {
      setSaving(true);
      await api.post("/user/favorites", { hostelId: hostel._id });
      alert("Added to favorites");
    } catch (e) {
      console.error("Failed to add favorite", e);
      alert("Failed to add favorite");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-400/40">
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={hostel.image || "/placeholder-image.jpg"}
          alt={hostel.propertyTitle || "Hostel"}
          loading="lazy"
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-52"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          type="button"
          onClick={addToFavorites}
          disabled={saving}
          title="Save to favorites"
          aria-label="Save to favorites"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/90 text-red-500 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900/90 dark:text-red-400 dark:hover:bg-slate-800"
        >
          <FaHeart className={saving ? "animate-pulse" : ""} />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
          {hostel.propertyType || "Hostel"}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          {hostel.propertyTitle || "Untitled property"}
        </h3>

        <div className="mt-2 flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <p className="flex min-w-0 items-center gap-2">
            <FaMapMarkerAlt className="shrink-0 text-blue-500" />
            <span className="break-words">
              {hostel.city || "Location not specified"}
            </span>
          </p>
          {hostel.nearbyCollege && (
            <p className="flex min-w-0 items-center gap-2">
              <FaUniversity className="shrink-0 text-indigo-500" />
              <span className="line-clamp-1">{hostel.nearbyCollege}</span>
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Monthly rent
            </p>
            <p className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
              ₹{Number(hostel.monthlyRent || 0).toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                /month
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default HostelCard;
