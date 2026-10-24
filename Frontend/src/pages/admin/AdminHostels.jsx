import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  Users,
  Loader2,
  Inbox,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  getAdminHostels,
  deleteHostel,
} from "../../services/adminHostelService";

import HostelStatusBadge from "../../components/admin/HostelStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminHostels() {
  const [hostels, setHostels] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminHostels();
      const data = response.data;

      const hostelList = Array.isArray(data)
        ? data
        : data?.hostels || data?.data || [];

      setHostels(hostelList);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hostel permanently?"
    );

    if (!confirmed) return;

    try {
      setWorkingId(id);
      setError("");

      await deleteHostel(id);

      setHostels((current) =>
        current.filter((hostel) => hostel._id !== id)
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  const filteredHostels = useMemo(() => {
    const query = search.trim().toLowerCase();

    return hostels.filter((hostel) => {
      const matchesSearch =
        !query ||
        hostel.propertyTitle?.toLowerCase().includes(query) ||
        hostel.city?.toLowerCase().includes(query) ||
        hostel.nearbyCollege?.toLowerCase().includes(query) ||
        hostel.address?.toLowerCase().includes(query);

      const currentStatus = String(hostel.status || "").toLowerCase();
      const matchesStatus = !status || currentStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [hostels, search, status]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-4 w-4" />
                Admin Panel
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Hostel Management
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create, view, edit and manage your accommodation properties.
              </p>
            </div>

            <Link
              to="/admin/hostels/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Hostel
            </Link>
          </div>
        </section>

        {/* Toolbar */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search hostel, city, college or address..."
                aria-label="Search hostels"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
              />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter hostels by status"
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {filteredHostels.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {hostels.length}
                </span>{" "}
                hostels
              </p>

              {(search || status) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                  }}
                  className="inline-flex items-center gap-1 self-start text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 sm:self-auto"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/70 dark:bg-red-950/40"
          >
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                Unable to load hostels
              </p>
              <p className="mt-1 break-words text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <section className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="h-52 w-full animate-pulse bg-slate-200 dark:bg-slate-800 lg:h-56 lg:w-56" />
                  <div className="flex-1 space-y-4 p-6">
                    <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[1, 2, 3, 4].map((stat) => (
                        <div
                          key={stat}
                          className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Empty */}
        {!loading && filteredHostels.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Inbox className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {hostels.length === 0 ? "No hostels yet" : "No matching hostels"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {hostels.length === 0
                ? "Create your first hostel to get started."
                : "Try changing your search or status filter."}
            </p>

            {hostels.length === 0 && (
              <Link
                to="/admin/hostels/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Hostel
              </Link>
            )}
          </section>
        )}

        {/* Hostel list */}
        {!loading && filteredHostels.length > 0 && (
          <section className="space-y-4">
            {filteredHostels.map((hostel) => {
              const image = hostel.images?.[0] || hostel.image || "";
              const gender = hostel.genderPreference || "Any";
              const rent = Number(hostel.monthlyRent) || 0;
              const isWorking = workingId === hostel._id;

              return (
                <article
                  key={hostel._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="relative h-52 w-full shrink-0 bg-slate-100 dark:bg-slate-800 lg:h-auto lg:min-h-[280px] lg:w-64">
                      {image ? (
                        <img
                          src={image}
                          alt={hostel.propertyTitle || "Hostel"}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-52 items-center justify-center">
                          <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                        </div>
                      )}

                      <div className="absolute left-3 top-3">
                        <HostelStatusBadge status={hostel.status} />
                      </div>

                      {hostel.images?.length > 1 && (
                        <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-white">
                          +{hostel.images.length - 1} photos
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                              {hostel.propertyTitle || "Untitled Hostel"}
                            </h2>

                            {hostel.propertyType && (
                              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                {hostel.propertyType}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                              {hostel.city || "-"}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                              {gender}
                            </span>
                          </div>

                          {hostel.nearbyCollege && (
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                              Near{" "}
                              <span className="font-medium text-slate-700 dark:text-slate-200">
                                {hostel.nearbyCollege}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 xl:text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            ₹{rent.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            monthly rent
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <MiniStat label="Rooms" value={hostel.totalRooms ?? 0} />
                        <MiniStat
                          label="Available"
                          value={hostel.availableRooms ?? 0}
                        />
                        <MiniStat
                          label="Rating"
                          value={`${Number(hostel.rating || 0).toFixed(1)}/5`}
                        />
                        <MiniStat
                          label="Reviews"
                          value={hostel.reviewCount ?? 0}
                        />
                      </div>

                      {/* Description */}
                      {hostel.description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {hostel.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <Link
                          to={`/admin/hostels/${hostel._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>

                        <Link
                          to={`/admin/hostels/${hostel._id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() => remove(hostel._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          {isWorking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      </div>
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

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/80">
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}
