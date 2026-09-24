import { useState } from "react";
import { FaCrosshairs, FaSpinner, FaCheckCircle } from "react-icons/fa";

import { saveMyLocation } from "../../services/locationService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function LocationButton({ onSaved }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          await saveMyLocation(latitude, longitude);

          setMessage("Location saved successfully.");

          onSaved?.({
            latitude,
            longitude,
          });
        } catch (err) {
          console.error("Save location error:", err);
          setError(getApiErrorMessage(err));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);

        const errors = {
          1: "Location permission was denied. Please allow location access.",
          2: "Unable to determine your location.",
          3: "Location request timed out. Please try again.",
        };

        setError(
          errors[err.code] ||
            "Unable to get your current location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleLocation}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <FaCrosshairs />
            Use My Current Location
          </>
        )}
      </button>

      {message && (
        <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <FaCheckCircle />
          {message}
        </p>
      )}

      {error && (
        <p className="mt-2 max-w-md text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}