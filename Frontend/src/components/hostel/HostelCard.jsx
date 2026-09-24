import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaArrowRight,
  FaBuilding,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

export default function HostelCard({ hostel }) {
  const image =
    typeof hostel?.images?.[0] === "string"
      ? hostel.images[0]
      : hostel?.images?.[0]?.url ||
        hostel?.image ||
        "https://via.placeholder.com/600x400?text=StudNest";

  const rating = Number(hostel?.rating || 0);
  const rent = Number(hostel?.monthlyRent || 0);
  const availableRooms = Number(hostel?.availableRooms || 0);

  const title = hostel?.propertyTitle || "Unnamed Hostel";
  const city = hostel?.city || "Location unavailable";
  const propertyType = hostel?.propertyType || "Hostel";
  const genderPreference = hostel?.genderPreference || "Any";

  const hasRooms = availableRooms > 0;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Image */}
      <div className="relative h-52 shrink-0 overflow-hidden sm:h-56">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/600x400?text=StudNest";
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2 sm:left-4 sm:right-4 sm:top-4">
          <span className="inline-flex max-w-[55%] items-center gap-1.5 truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-sm">
            <FaBuilding className="shrink-0 text-indigo-500" />
            <span className="truncate">{propertyType}</span>
          </span>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-sm sm:text-sm">
            <FaStar className="text-yellow-400" />

            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>
        </div>

        {/* Verified */}
        {hostel?.isVerified && (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            <FaShieldAlt />
            Verified
          </span>
        )}

        {/* Title + Location */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="truncate text-xl font-extrabold text-white drop-shadow-lg">
            {title}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white/90">
            <FaMapMarkerAlt className="shrink-0" />
            <span className="truncate">{city}</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Nearby College */}
        {hostel?.nearbyCollege ? (
          <div className="mb-4 rounded-2xl bg-indigo-50 px-3.5 py-3 dark:bg-indigo-900/20">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Near College
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              🎓 {hostel.nearbyCollege}
            </p>
          </div>
        ) : (
          <div className="mb-4 h-[68px] rounded-2xl bg-slate-50 dark:bg-slate-800/60" />
        )}

        {/* Info */}
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <FaUsers className="text-indigo-500" />
            {genderPreference}
          </span>

          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              hasRooms
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {hasRooms
              ? `${availableRooms} ${
                  availableRooms === 1 ? "room" : "rooms"
                } available`
              : "Currently unavailable"}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800">
          {/* Price */}
          <div>
            <p className="text-xs font-medium text-slate-400">
              Starting from
            </p>

            <div className="mt-0.5 flex items-baseline">
              <span className="text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                ₹{rent.toLocaleString()}
              </span>

              <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                /month
              </span>
            </div>
          </div>

          {/* Button */}
          <Link
            to={`/student/hostels/${hostel?._id}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            View Details

            <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}