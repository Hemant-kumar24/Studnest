import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  Save,
  Loader2,
  AlertCircle,
  Building2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import RoomForm from "../../components/admin/RoomForm";
import {
  createRoom,
  getRoom,
  updateRoom,
} from "../../services/adminRoomService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminRoomFormPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryHostelId = new URLSearchParams(location.search).get("hostelId");
  const currentHostelId = queryHostelId;
  const editing = Boolean(roomId);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") ||
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
  });

  useEffect(() => {
    const syncTheme = () => {
      setTheme(
        localStorage.getItem("theme") ||
          (document.documentElement.classList.contains("dark") ? "dark" : "light")
      );
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("studnest-theme-changed", syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("studnest-theme-changed", syncTheme);
      observer.disconnect();
    };
  }, []);

  const isDark = theme === "dark";

  useEffect(() => {
    if (!editing || !roomId) return;

    let active = true;

    const loadRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRoom(roomId);
        const roomData =
          response.data?.data ||
          response.data?.room ||
          response.data ||
          null;

        if (active) setRoom(roomData);
      } catch (err) {
        if (active) setError(getApiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRoom();

    return () => {
      active = false;
    };
  }, [roomId, editing]);

  const submit = async (data) => {
    try {
      setSaving(true);
      setError("");

      if (editing) {
        await updateRoom(roomId, data);
      } else {
        if (!currentHostelId) {
          throw new Error("Hostel ID is required to create a room.");
        }

        await createRoom(currentHostelId, data);
      }

      if (currentHostelId) {
        navigate(`/admin/rooms?hostelId=${encodeURIComponent(currentHostelId)}`);
      } else {
        navigate("/admin/rooms");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const backUrl = currentHostelId
    ? `/admin/rooms?hostelId=${encodeURIComponent(currentHostelId)}`
    : "/admin/hostels";

  const card = isDark
    ? "border-slate-700/80 bg-slate-900/80 shadow-black/10"
    : "border-slate-200 bg-white shadow-slate-200/60";
  const heading = isDark ? "text-slate-100" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";

  if (loading) {
    return (
      <main className={`min-h-screen px-4 py-6 transition-colors sm:px-6 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className={`h-5 w-40 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <div className={`h-32 rounded-2xl ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <div className={`h-[440px] rounded-2xl ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <p className={`text-center text-sm ${muted}`}>Loading room details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to={backUrl}
            className={`mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold transition hover:-translate-x-0.5 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
          >
            <ArrowLeft size={17} />
            Back to Rooms
          </Link>

          {/* Page header */}
          <section className={`mb-6 overflow-hidden rounded-2xl border shadow-sm ${card}`}>
            <div className={`h-1.5 bg-gradient-to-r ${isDark ? "from-indigo-400 via-violet-400 to-fuchsia-400" : "from-indigo-600 via-violet-600 to-fuchsia-500"}`} />
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isDark ? "bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-300/20" : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"}`}>
                    <BedDouble size={27} />
                  </div>
                  <div>
                    <div className={`mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>
                      <Sparkles size={13} /> StudNest Admin
                    </div>
                    <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${heading}`}>
                      {editing ? "Edit Room" : "Add New Room"}
                    </h1>
                    <p className={`mt-2 max-w-2xl text-sm leading-6 sm:text-base ${muted}`}>
                      {editing
                        ? "Update room details, pricing, capacity and availability."
                        : "Create a room listing with accurate capacity, pricing and amenities."}
                    </p>
                  </div>
                </div>

                <div className={`hidden items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold sm:flex ${isDark ? "border-slate-700 bg-slate-950/60 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                  <Save size={17} className={isDark ? "text-indigo-300" : "text-indigo-600"} />
                  {editing ? "Update room details" : "Create room listing"}
                </div>
              </div>
            </div>
          </section>

          {/* Hostel context */}
          {currentHostelId && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${isDark ? "border-indigo-400/20 bg-indigo-400/10" : "border-indigo-100 bg-indigo-50/70"}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-slate-900 text-indigo-300" : "bg-white text-indigo-600"}`}>
                <Building2 size={19} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>Selected hostel</p>
                <p className={`mt-1 break-all text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  {currentHostelId}
                </p>
              </div>
              <CheckCircle2 size={18} className={`ml-auto shrink-0 ${isDark ? "text-emerald-300" : "text-emerald-600"}`} />
            </motion.div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                role="alert"
                className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${isDark ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{editing ? "Unable to update room" : "Unable to create room"}</p>
                  <p className="mt-1 break-words text-sm">{error}</p>
                </div>
                <button type="button" onClick={() => setError("")} className="text-xs font-bold underline underline-offset-2">
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <section className={`overflow-hidden rounded-2xl border shadow-sm ${card}`}>
            <div className={`border-b px-5 py-5 sm:px-7 ${isDark ? "border-slate-700 bg-slate-950/50" : "border-slate-100 bg-slate-50/80"}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-slate-800 text-indigo-300" : "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"}`}>
                  <BedDouble size={19} />
                </div>
                <div>
                  <h2 className={`font-bold ${heading}`}>Room Information</h2>
                  <p className={`mt-0.5 text-xs ${muted}`}>Complete the fields below, then save your changes.</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <RoomForm room={room} onSubmit={submit} saving={saving} />
            </div>
          </section>

          {/* Helpful note */}
          <div className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-emerald-400/10 text-emerald-300" : "bg-emerald-50 text-emerald-600"}`}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className={`text-sm font-bold ${heading}`}>Double-check before saving</p>
              <p className={`mt-1 text-xs leading-5 ${muted}`}>
                Verify the room number, type, capacity, price, amenities and availability so students see accurate information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Saving overlay */}
        <AnimatePresence>
          {saving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className={`flex w-full max-w-sm items-center gap-4 rounded-2xl border p-5 shadow-2xl ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-indigo-400/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                  <Loader2 size={22} className="animate-spin" />
                </div>
                <div>
                  <p className={`text-sm font-extrabold ${heading}`}>
                    {editing ? "Updating room..." : "Creating room..."}
                  </p>
                  <p className={`mt-1 text-xs ${muted}`}>Please wait while we save your changes.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
