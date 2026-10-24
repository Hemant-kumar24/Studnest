import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaUser,
  FaSyncAlt,
} from "react-icons/fa";

import ProfileForm from "../../components/student/ProfileForm";
import { getMyLocation } from "../../services/locationService";
import studentProfileService from "../../services/studentProfileService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshingLocation, setRefreshingLocation] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const [profileResponse, locationResponse] = await Promise.all([
        studentProfileService.getProfile(),
        getMyLocation(),
      ]);

      const profile =
        profileResponse?.user ||
        profileResponse?.data?.user ||
        profileResponse?.data ||
        profileResponse;

      const savedLocation =
        locationResponse?.data?.data ||
        locationResponse?.data?.location ||
        locationResponse?.location ||
        locationResponse?.data ||
        null;

      setUser(profile);
      setLocation(savedLocation);
    } catch (err) {
      console.error("Student profile load error:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data) => {
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const response = await studentProfileService.updateProfile(data);
      const updatedUser =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        response;
      setUser(updatedUser);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Student profile update error:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const refreshLocation = async () => {
    try {
      setRefreshingLocation(true);
      setMessage("");
      setError("");
      const response = await getMyLocation();
      const savedLocation =
        response?.data?.data ||
        response?.data?.location ||
        response?.location ||
        response?.data ||
        null;
      setLocation(savedLocation);
      setMessage("Location refreshed.");
    } catch (err) {
      console.error("Student location refresh error:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setRefreshingLocation(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-56 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-96 rounded-3xl bg-white dark:bg-slate-900" />
          <div className="h-48 rounded-3xl bg-white dark:bg-slate-900" />
        </div>
      </main>
    );
  }

  const hasGeoJsonLocation =
    Array.isArray(location?.coordinates) && location.coordinates.length === 2;
  const hasLatLng =
    location?.latitude != null && location?.longitude != null;

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Page heading aligned to the same content grid as the form */}
        <section className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Student Panel
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Manage your personal details and saved location.
          </p>
        </section>

        {message && (
          <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400 sm:px-5">
            <FaCheckCircle className="shrink-0" />
            {message}
          </div>
        )}
        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 sm:px-5">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main profile card */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-6 text-white sm:px-8 sm:py-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl ring-1 ring-white/20 backdrop-blur-sm sm:h-14 sm:w-14 sm:text-2xl">
                <FaUser />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-indigo-100 sm:text-sm">Personal Information</p>
                <h2 className="mt-1 break-words text-xl font-bold sm:text-2xl">
                  {user?.name || "Student"}
                </h2>
                <p className="mt-1 text-xs text-white/75 sm:text-sm">
                  Keep your account information up to date.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 dark:bg-slate-900 sm:p-6 lg:p-8">
            <ProfileForm user={user} onSave={saveProfile} />
            {saving && (
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                Saving profile...
              </div>
            )}
          </div>
        </section>

        {/* Location card uses the same width, radius and spacing as the profile form */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-8 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 sm:h-11 sm:w-11">
                <FaMapMarkerAlt className="text-lg text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Saved Location</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Used to find hostels near you.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={refreshLocation}
              disabled={refreshingLocation}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <FaSyncAlt className={refreshingLocation ? "animate-spin" : ""} />
              {refreshingLocation ? "Refreshing..." : "Refresh location"}
            </button>
          </div>

          <div className="bg-white p-4 dark:bg-slate-900 sm:p-6 lg:p-8">
            {hasGeoJsonLocation ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <CoordinateCard label="Latitude" value={location.coordinates[1]} />
                <CoordinateCard label="Longitude" value={location.coordinates[0]} />
              </div>
            ) : hasLatLng ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <CoordinateCard label="Latitude" value={location.latitude} />
                <CoordinateCard label="Longitude" value={location.longitude} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
                <FaMapMarkerAlt className="mx-auto mb-3 text-3xl text-slate-300 dark:text-slate-600" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">No location saved yet</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Save your location to discover nearby hostels.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CoordinateCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}
