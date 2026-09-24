import {
  FaBed,
  FaCheckCircle,
  FaUsers,
  FaDoorOpen,
  FaRupeeSign,
  FaTools,
} from "react-icons/fa";

export default function RoomCard({ room, selected, onSelect }) {
  const status = String(room?.status || "").toLowerCase();

  const availableBeds = Number(room?.availableBeds || 0);
  const capacity = Number(room?.capacity || 0);
  const price = Number(room?.price || 0);

  const isAvailable = status === "available" && availableBeds > 0;
  const isFull = status === "full" || availableBeds <= 0;
  const isMaintenance = status === "maintenance";
  const isInactive = status === "inactive";

  const getStatusText = () => {
    if (isMaintenance) return "Maintenance";
    if (isInactive) return "Inactive";
    if (isFull) return "Full";
    return "Available";
  };

  const getStatusClasses = () => {
    if (isMaintenance) {
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    }

    if (isInactive) {
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }

    if (isFull) {
      return "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    }

    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 dark:bg-slate-900 ${
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
          : "border-slate-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:hover:border-indigo-800"
      }`}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
          <FaCheckCircle />
          Selected
        </div>
      )}

      {/* Room Header */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            selected
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <FaBed className="text-lg" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {room?.roomType || "Room"}
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            Room {room?.roomNumber || "N/A"}
          </h3>

          {/* Status */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses()}`}
            >
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {/* Capacity */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-slate-400">
            <FaUsers className="text-xs" />
            <span className="text-xs">Capacity</span>
          </div>

          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            {capacity} {capacity === 1 ? "bed" : "beds"}
          </p>
        </div>

        {/* Available Beds */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-slate-400">
            <FaDoorOpen className="text-xs" />
            <span className="text-xs">Available</span>
          </div>

          <p
            className={`mt-1 text-sm font-bold ${
              isAvailable
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {availableBeds}{" "}
            {availableBeds === 1 ? "bed" : "beds"}
          </p>
        </div>
      </div>

      {/* Amenities */}
      {Array.isArray(room?.amenities) && room.amenities.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Amenities
          </p>

          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 5).map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {item}
              </span>
            ))}

            {room.amenities.length > 5 && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                +{room.amenities.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        {/* Price */}
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly rent
          </p>

          <div className="mt-1 flex items-baseline">
            <FaRupeeSign className="mr-0.5 text-sm text-indigo-600 dark:text-indigo-400" />

            <strong className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {price.toLocaleString("en-IN")}
            </strong>

            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
              /month
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          disabled={!isAvailable}
          onClick={() => {
            if (isAvailable && onSelect) {
              onSelect(room);
            }
          }}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 sm:w-auto ${
            !isAvailable
              ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
              : selected
              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
              : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md"
          }`}
        >
          {!isAvailable ? (
            <>
              {isMaintenance ? (
                <>
                  <FaTools />
                  Maintenance
                </>
              ) : isInactive ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Inactive
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Full
                </>
              )}
            </>
          ) : selected ? (
            <>
              <FaCheckCircle />
              Selected
            </>
          ) : (
            <>
              <FaBed />
              Select Room
            </>
          )}
        </button>
      </div>
    </article>
  );
}