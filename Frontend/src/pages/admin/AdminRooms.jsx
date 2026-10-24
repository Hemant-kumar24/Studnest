import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  BedDouble,
  IndianRupee,
  Users,
  Pencil,
  Wrench,
  CheckCircle,
  Trash2,
  Loader2,
  Inbox,
  Sparkles,
  Building2,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getHostelRooms,
  deleteRoom,
  updateRoomAvailability,
} from "../../services/adminRoomService";
import RoomStatusBadge from "../../components/admin/RoomStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminRooms() {
  const location = useLocation();
  const hostelId = new URLSearchParams(location.search).get("hostelId");

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") ||
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
  });

  useEffect(() => {
    const syncTheme = () => {
      setTheme(localStorage.getItem("theme") ||
        (document.documentElement.classList.contains("dark") ? "dark" : "light"));
    };
    window.addEventListener("storage", syncTheme);
    window.addEventListener("studnest-theme-changed", syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("studnest-theme-changed", syncTheme);
      observer.disconnect();
    };
  }, []);

  const isDark = theme === "dark";
  const heading = isDark ? "text-slate-100" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const card = isDark
    ? "border-slate-700/80 bg-slate-900/80 shadow-black/10"
    : "border-slate-200 bg-white shadow-slate-200/60";

  const load = async () => {
    if (!hostelId) {
      setLoading(false);
      setError("Hostel ID is missing. Please select a hostel first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getHostelRooms(hostelId);
      const data = response.data?.data;

      if (Array.isArray(data)) {
        setRooms(data);
        setHostel(response.data?.hostel || null);
      } else {
        setRooms(response.data?.rooms || data?.rooms || []);
        setHostel(response.data?.hostel || data?.hostel || null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelId, refreshKey]);

  const remove = async (roomId) => {
    if (!window.confirm("Delete this room permanently?")) return;

    try {
      setWorkingId(roomId);
      setError("");
      await deleteRoom(roomId);
      setRooms((items) => items.filter((room) => room._id !== roomId));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  const toggleAvailability = async (room) => {
    try {
      setWorkingId(room._id);
      setError("");
      const status = String(room.status || "").toLowerCase();
      const nextStatus = status === "maintenance" ? "available" : "maintenance";
      await updateRoomAvailability(room._id, { status: nextStatus });
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  const backLink = (
    <Link
      to="/admin/hostels"
      className={`mb-5 inline-flex items-center gap-2 text-sm font-semibold transition hover:-translate-x-0.5 ${muted} ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}
    >
      <ArrowLeft size={17} /> Back to Hostels
    </Link>
  );

  if (!hostelId) {
    return (
      <main className={`min-h-screen px-4 py-8 sm:px-6 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-7xl">
          {backLink}
          <section className={`rounded-2xl border p-8 text-center shadow-sm sm:p-12 ${card}`}>
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-red-400/10 text-red-300" : "bg-red-50 text-red-500"}`}>
              <Building2 size={28} />
            </div>
            <h1 className={`mt-5 text-xl font-extrabold ${heading}`}>Hostel ID is missing</h1>
            <p className={`mx-auto mt-2 max-w-md text-sm ${muted}`}>Open room management from a specific hostel to view and manage its rooms.</p>
            <Link to="/admin/hostels" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
              <ArrowLeft size={16} /> Go to Hostels
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const filteredRooms = rooms.filter((room) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query ||
      String(room.roomNumber ?? "").toLowerCase().includes(query) ||
      String(room.roomType ?? "").toLowerCase().includes(query) ||
      String(room._id ?? "").toLowerCase().includes(query);
    const status = String(room.status || "").toLowerCase();
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-7">
          {backLink}
          <div className={`overflow-hidden rounded-2xl border shadow-sm ${card}`}>
            <div className={`h-1.5 bg-gradient-to-r ${isDark ? "from-indigo-400 via-violet-400 to-fuchsia-400" : "from-indigo-600 via-violet-600 to-fuchsia-500"}`} />
            <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isDark ? "bg-indigo-400/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                  <BedDouble size={27} />
                </div>
                <div className="min-w-0">
                  <div className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>
                    <Sparkles size={13} /> StudNest Admin
                  </div>
                  <h1 className={`break-words text-2xl font-extrabold tracking-tight sm:text-3xl ${heading}`}>
                    {hostel?.propertyTitle || "Room Management"}
                  </h1>
                  <p className={`mt-2 max-w-xl text-sm leading-6 ${muted}`}>Manage room details, bed capacity, monthly rent and availability.</p>
                  <p className={`mt-2 break-all text-xs ${muted}`}>Hostel ID: {hostelId}</p>
                </div>
              </div>
              <Link to={`/admin/rooms/create?hostelId=${encodeURIComponent(hostelId)}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700">
                <Plus size={17} /> Add Room
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard dark={isDark} label="Total rooms" value={rooms.length} icon={<BedDouble size={21} />} tone="indigo" />
          <SummaryCard dark={isDark} label="Available rooms" value={rooms.filter((room) => String(room.status || "").toLowerCase() === "available").length} icon={<CheckCircle size={21} />} tone="emerald" />
          <SummaryCard dark={isDark} label="Maintenance" value={rooms.filter((room) => String(room.status || "").toLowerCase() === "maintenance").length} icon={<Wrench size={21} />} tone="amber" />
        </section>

        <section className={`mb-6 rounded-2xl border p-4 shadow-sm sm:p-5 ${card}`}>
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <div>
              <label htmlFor="room-search" className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Search rooms</label>
              <div className="relative">
                <Search size={17} className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${muted}`} />
                <input id="room-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Room number, type or ID..." className={`min-h-11 w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${isDark ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-indigo-400/15" : "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15"}`} />
              </div>
            </div>
            <div>
              <label htmlFor="room-status" className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Room status</label>
              <select id="room-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={`min-h-11 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-4 ${isDark ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-indigo-400 focus:ring-indigo-400/15" : "border-slate-300 bg-white text-slate-800 focus:border-indigo-500 focus:ring-indigo-500/15"}`}>
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
            <button type="button" onClick={() => setRefreshKey((value) => value + 1)} disabled={loading} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </section>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} role="alert" className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${isDark ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="font-bold underline underline-offset-2">Retry</button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={`h-80 animate-pulse rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`} />
            ))}
          </section>
        )}

        {!loading && !error && rooms.length === 0 && (
          <EmptyState dark={isDark} filtered={false} hostelId={hostelId} />
        )}

        {!loading && !error && rooms.length > 0 && filteredRooms.length === 0 && (
          <EmptyState dark={isDark} filtered hostelId={hostelId} />
        )}

        {!loading && !error && filteredRooms.length > 0 && (
          <motion.section layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map((room) => {
              const isWorking = workingId === room._id;
              const amenities = Array.isArray(room.amenities) ? room.amenities : room.amenities ? [room.amenities] : [];
              const status = String(room.status || "").toLowerCase();
              const isMaintenance = status === "maintenance";

              return (
                <motion.article
                  layout
                  key={room._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`group overflow-hidden rounded-2xl border shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${card}`}
                >
                  <div className={`border-b p-5 ${isDark ? "border-slate-700 bg-gradient-to-br from-slate-800/80 to-slate-900" : "border-slate-100 bg-gradient-to-br from-slate-50 to-white"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-indigo-400/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                          <BedDouble size={21} />
                        </div>
                        <div className="min-w-0">
                          <h2 className={`truncate text-lg font-extrabold ${heading}`}>Room {room.roomNumber ?? "—"}</h2>
                          <p className={`mt-0.5 truncate text-sm ${muted}`}>{room.roomType || "Room"}</p>
                        </div>
                      </div>
                      <RoomStatusBadge status={room.status} availableBeds={room.availableBeds} capacity={room.capacity} />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className={`mb-4 rounded-xl border p-4 ${isDark ? "border-slate-700 bg-slate-950/70" : "border-slate-100 bg-slate-50"}`}>
                      <p className={`text-xs font-bold uppercase tracking-wider ${muted}`}>Monthly rent</p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <IndianRupee size={19} className={isDark ? "text-slate-300" : "text-slate-700"} />
                        <span className={`text-2xl font-extrabold tracking-tight ${heading}`}>{Number(room.price || 0).toLocaleString("en-IN")}</span>
                        <span className={`text-xs ${muted}`}>/ month</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DetailBox dark={isDark} icon={<Users size={16} />} label="Capacity" value={`${room.capacity || 0} beds`} />
                      <DetailBox dark={isDark} icon={<BedDouble size={16} />} label="Available" value={`${room.availableBeds || 0} beds`} />
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles size={15} className="text-purple-500" />
                        <p className={`text-xs font-bold uppercase tracking-wider ${muted}`}>Amenities</p>
                      </div>
                      {amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {amenities.slice(0, 6).map((amenity, index) => (
                            <span key={`${amenity}-${index}`} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${isDark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{amenity}</span>
                          ))}
                          {amenities.length > 6 && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>+{amenities.length - 6} more</span>}
                        </div>
                      ) : (
                        <p className={`text-sm ${muted}`}>No amenities listed</p>
                      )}
                    </div>

                    <div className={`mt-6 space-y-2 border-t pt-4 ${isDark ? "border-slate-700" : "border-slate-100"}`}>
                      <Link to={`/admin/rooms/${room._id}/edit?hostelId=${encodeURIComponent(hostelId)}`} className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${isDark ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                        <Pencil size={15} /> Edit Room
                      </Link>
                      <button type="button" disabled={isWorking} onClick={() => toggleAvailability(room)} className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${isMaintenance ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-500 hover:bg-amber-600"}`}>
                        {isWorking ? <Loader2 size={16} className="animate-spin" /> : isMaintenance ? <CheckCircle size={16} /> : <Wrench size={16} />}
                        {isMaintenance ? "Make Available" : "Mark Maintenance"}
                      </button>
                      <button type="button" disabled={isWorking} onClick={() => remove(room._id)} className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? "border-red-400/20 bg-red-400/5 text-red-300 hover:bg-red-400/10" : "border-red-200 bg-white text-red-600 hover:bg-red-50"}`}>
                        {isWorking ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete Room
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ dark, label, value, icon, tone }) {
  const tones = {
    indigo: dark ? "bg-indigo-400/10 text-indigo-300" : "bg-indigo-50 text-indigo-600",
    emerald: dark ? "bg-emerald-400/10 text-emerald-300" : "bg-emerald-50 text-emerald-600",
    amber: dark ? "bg-amber-400/10 text-amber-300" : "bg-amber-50 text-amber-600",
  };
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${dark ? "border-slate-700/80 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
          <p className={`mt-2 text-3xl font-extrabold ${dark ? "text-slate-100" : "text-slate-900"}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}>{icon}</div>
      </div>
    </div>
  );
}

function DetailBox({ icon, label, value, dark }) {
  return (
    <div className={`rounded-xl border p-3 ${dark ? "border-slate-700 bg-slate-950/60" : "border-slate-100 bg-slate-50"}`}>
      <div className={`flex items-center gap-1.5 ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
        {icon}
        <span className={`text-xs font-bold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
      </div>
      <p className={`mt-1 text-sm font-extrabold ${dark ? "text-slate-100" : "text-slate-800"}`}>{value}</p>
    </div>
  );
}

function EmptyState({ dark, filtered, hostelId }) {
  return (
    <section className={`rounded-2xl border border-dashed px-6 py-14 text-center ${dark ? "border-slate-700 bg-slate-900/60" : "border-slate-300 bg-white"}`}>
      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
        <Inbox size={28} />
      </div>
      <h2 className={`mt-4 text-lg font-extrabold ${dark ? "text-slate-100" : "text-slate-900"}`}>{filtered ? "No matching rooms" : "No rooms found"}</h2>
      <p className={`mx-auto mt-2 max-w-md text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
        {filtered ? "Try a different search or status filter." : "Add the first room for this hostel to start managing its availability and pricing."}
      </p>
      {!filtered && (
        <Link to={`/admin/rooms/create?hostelId=${encodeURIComponent(hostelId)}`} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
          <Plus size={16} /> Add First Room
        </Link>
      )}
    </section>
  );
}
