import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaUser,
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, locationResponse] =
        await Promise.all([
          studentProfileService.getProfile(),
          getMyLocation(),
        ]);

      // Backend returns user directly
      const profile =
        profileResponse?.user ||
        profileResponse?.data ||
        profileResponse;

      // Location response can have different wrappers
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

      const response =
        await studentProfileService.updateProfile(data);

      const updatedUser =
        response?.user ||
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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-9 w-56 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-80 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="h-96 rounded-3xl bg-white dark:bg-slate-900" />
          <div className="h-48 rounded-3xl bg-white dark:bg-slate-900" />
        </div>
      </main>
    );
  }

  const hasGeoJsonLocation =
    Array.isArray(location?.coordinates) &&
    location.coordinates.length === 2;

  const hasLatLng =
    location?.latitude != null &&
    location?.longitude != null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Student Panel
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your personal details and saved location.
          </p>
        </section>

        {/* Success */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
            <FaCheckCircle className="shrink-0" />
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-7 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                <FaUser />
              </div>

              <div>
                <p className="text-sm text-indigo-100">
                  Personal Information
                </p>

                <h2 className="text-xl font-bold">
                  {user?.name || "Student"}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <ProfileForm
              user={user}
              onSave={saveProfile}
            />

            {saving && (
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                Saving profile...
              </div>
            )}
          </div>
        </section>

        {/* Location */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800 sm:px-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <FaMapMarkerAlt className="text-lg text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Saved Location
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Used to find hostels near you.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {hasGeoJsonLocation ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <CoordinateCard
                  label="Latitude"
                  value={location.coordinates[1]}
                />

                <CoordinateCard
                  label="Longitude"
                  value={location.coordinates[0]}
                />
              </div>
            ) : hasLatLng ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <CoordinateCard
                  label="Latitude"
                  value={location.latitude}
                />

                <CoordinateCard
                  label="Longitude"
                  value={location.longitude}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
                <FaMapMarkerAlt className="mx-auto mb-3 text-3xl text-slate-300 dark:text-slate-600" />

                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  No location saved yet
                </h3>

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
    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}