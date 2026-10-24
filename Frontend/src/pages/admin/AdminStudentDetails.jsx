import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  Mail,
  AlertTriangle,
  House,
  Phone,
  Star,
  UserRound,
  MapPin,
  ShieldCheck,
  Clock3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import adminStudentService from "../../services/adminStudentService";
import StudentStatusBadge from "../../components/admin/StudentStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminStudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Student ID is missing.");
      return;
    }

    let active = true;
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await adminStudentService.getStudentById(id);
        const studentData =
          response?.student ||
          response?.data?.student ||
          response?.data ||
          response;
        if (active) setStudent(studentData || null);
      } catch (err) {
        console.error("Load student details error:", err);
        if (active) setError(getApiErrorMessage(err) || "Unable to load student.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStudent();
    return () => {
      active = false;
    };
  }, [id, refreshKey]);

  if (loading) {
    return (
      <main className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className={`h-5 w-36 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <div className={`rounded-2xl border p-6 ${card}`}>
            <div className="flex gap-5">
              <div className={`h-20 w-20 rounded-2xl ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              <div className="flex-1 space-y-3">
                <div className={`h-7 w-56 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
                <div className={`h-4 w-72 max-w-full rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`h-64 rounded-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} />
            <div className={`h-64 rounded-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} />
          </div>
          <div className={`h-64 rounded-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} />
          <p className={`text-center text-sm ${muted}`}>Loading student details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-5xl">
          <Link to="/admin/students" className={`mb-6 inline-flex items-center gap-2 text-sm font-semibold transition ${muted} ${isDark ? "hover:text-white" : "hover:text-indigo-600"}`}>
            <ArrowLeft size={17} /> Back to Students
          </Link>
          <div role="alert" className={`flex items-start gap-3 rounded-2xl border p-5 ${isDark ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <h2 className="font-bold">Unable to load student</h2>
              <p className="mt-1 text-sm">{error}</p>
              <button onClick={() => setRefreshKey((value) => value + 1)} type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-2">
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!student) {
    return (
      <main className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-5xl">
          <Link to="/admin/students" className={`inline-flex items-center gap-2 text-sm font-semibold ${muted}`}>
            <ArrowLeft size={17} /> Back to Students
          </Link>
          <div className={`mt-6 rounded-2xl border px-6 py-14 text-center ${card}`}>
            <UserRound size={34} className={`mx-auto ${muted}`} />
            <h2 className={`mt-4 text-lg font-extrabold ${heading}`}>Student not found</h2>
            <p className={`mt-1 text-sm ${muted}`}>The requested student does not exist or is no longer available.</p>
          </div>
        </div>
      </main>
    );
  }

  const bookings = Array.isArray(student.bookings) ? student.bookings : [];
  const complaints = Array.isArray(student.complaints) ? student.complaints : [];
  const reviews = Array.isArray(student.reviews) ? student.reviews : [];
  const isActive = student.isActive !== false;
  const studentLocation = student.location || {};

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-8 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/admin/students" className={`inline-flex items-center gap-2 text-sm font-semibold transition hover:-translate-x-0.5 ${muted} ${isDark ? "hover:text-white" : "hover:text-indigo-600"}`}>
            <ArrowLeft size={17} /> Back to Students
          </Link>
        </motion.div>

        {/* Student profile header */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`overflow-hidden rounded-2xl border shadow-sm ${card}`}>
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-5 py-7 text-white sm:px-7 sm:py-8">
            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-fuchsia-400/10 blur-2xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/15 text-3xl font-extrabold shadow-lg">
                {student.profileImage ? (
                  <img src={student.profileImage} alt={student.name || "Student"} className="h-full w-full object-cover" />
                ) : (
                  (student.name || "S").charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">{student.name || "Student"}</h1>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${isActive ? "border-emerald-200/20 bg-emerald-300/20 text-emerald-100" : "border-red-200/20 bg-red-300/20 text-red-100"}`}>
                    {isActive ? "Active account" : "Inactive account"}
                  </span>
                </div>
                <p className="flex min-w-0 items-center gap-2 break-all text-sm text-indigo-100">
                  <Mail size={15} className="shrink-0" /> {student.email || "No email provided"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white/90">
                  <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5">Role: {student.role || "student"}</span>
                  {studentLocation.city && <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5"><MapPin size={12} /> {studentLocation.city}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-2 divide-x border-t sm:grid-cols-4 ${isDark ? "divide-slate-700 border-slate-700" : "divide-slate-100 border-slate-100"}`}>
            <Stat dark={isDark} label="Bookings" value={bookings.length} icon={<CalendarDays size={18} />} />
            <Stat dark={isDark} label="Complaints" value={complaints.length} icon={<AlertTriangle size={18} />} />
            <Stat dark={isDark} label="Reviews" value={reviews.length} icon={<Star size={18} />} />
            <Stat dark={isDark} label="Account" value={isActive ? "Active" : "Inactive"} icon={<ShieldCheck size={18} />} />
          </div>
        </motion.section>

        {/* Profile + account details */}
        <section className="grid gap-6 lg:grid-cols-2">
          <InfoPanel dark={isDark} icon={<UserRound size={19} />} title="Profile Information" subtitle="Student contact and location details.">
            <div className="grid gap-5 sm:grid-cols-2">
              <InfoItem dark={isDark} icon={<UserRound size={14} />} label="Full name" value={student.name} />
              <InfoItem dark={isDark} icon={<Mail size={14} />} label="Email address" value={student.email} />
              <InfoItem dark={isDark} icon={<Phone size={14} />} label="Phone number" value={student.phone} />
              <InfoItem dark={isDark} icon={<MapPin size={14} />} label="City / Address" value={studentLocation.city || studentLocation.address} />
            </div>
          </InfoPanel>

          <InfoPanel dark={isDark} icon={<ShieldCheck size={19} />} title="Account Information" subtitle="Account status and registration details.">
            <div className="space-y-5">
              <InfoItem dark={isDark} label="Account status" value={isActive ? "Active" : "Inactive"} />
              <InfoItem dark={isDark} icon={<Clock3 size={14} />} label="Registered on" value={student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"} />
              <InfoItem dark={isDark} label="User role" value={student.role || "student"} />
            </div>
          </InfoPanel>
        </section>

        {/* Booking history */}
        <DataSection dark={isDark} icon={<House size={19} />} title="Booking History" count={bookings.length}>
          {bookings.length === 0 ? (
            <EmptyState dark={isDark} icon={<CalendarDays size={21} />} title="No booking history" text="This student has not made any bookings yet." />
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <article key={booking._id} className={`rounded-xl border p-4 transition ${isDark ? "border-slate-700 bg-slate-950/40 hover:border-indigo-400/40" : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className={`break-words font-bold ${heading}`}>{booking.hostelId?.propertyTitle || "Hostel"}</h3>
                      <div className={`mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm ${muted}`}>
                        <span className="inline-flex items-center gap-2"><BedDouble size={14} /> {booking.roomId?.roomNumber ? `Room ${booking.roomId.roomNumber}` : booking.roomType || "Room"}</span>
                        <span>{booking.duration ? `${booking.duration} month${booking.duration !== 1 ? "s" : ""}` : "Duration —"}</span>
                        <span>{booking.startDate ? new Date(booking.startDate).toLocaleDateString("en-IN") : "Start date —"}</span>
                      </div>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className={`font-extrabold ${heading}`}>₹{Number(booking.amount || 0).toLocaleString("en-IN")}</p>
                      <StatusPill value={booking.status || "Pending"} dark={isDark} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </DataSection>

        {/* Complaints */}
        <DataSection dark={isDark} icon={<AlertTriangle size={19} />} title="Complaints" count={complaints.length}>
          {complaints.length === 0 ? (
            <EmptyState dark={isDark} icon={<CheckCircle2 size={21} />} title="No complaints" text="This student has no complaint history." />
          ) : (
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <article key={complaint._id} className={`rounded-xl border p-4 ${isDark ? "border-slate-700 bg-slate-950/40" : "border-slate-200"}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className={`break-words font-bold ${heading}`}>{complaint.subject || complaint.category || "Complaint"}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Tag dark={isDark}>{complaint.category || "Other"}</Tag>
                        <Tag dark={isDark} tone="amber">{complaint.priority || "Medium"}</Tag>
                        <StatusPill value={complaint.status || "Open"} dark={isDark} />
                      </div>
                      <p className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 ${muted}`}>{complaint.description || "No description provided."}</p>
                    </div>
                    <p className={`shrink-0 text-xs ${muted}`}>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString("en-IN") : "—"}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </DataSection>

        {/* Reviews */}
        <DataSection dark={isDark} icon={<MessageSquare size={19} />} title="Reviews" count={reviews.length}>
          {reviews.length === 0 ? (
            <EmptyState dark={isDark} icon={<Star size={21} />} title="No reviews" text="This student has not submitted any reviews." />
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article key={review._id} className={`rounded-xl border p-4 ${isDark ? "border-slate-700 bg-slate-950/40" : "border-slate-200"}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className={`break-words font-bold ${heading}`}>{review.hostelId?.propertyTitle || "Hostel"}</h3>
                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} size={15} className={index < Number(review.rating || 0) ? "fill-amber-400 text-amber-400" : isDark ? "text-slate-700" : "text-slate-200"} />
                        ))}
                        <span className={`ml-2 text-xs font-bold ${muted}`}>{review.rating || 0}/5</span>
                      </div>
                      <p className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 ${muted}`}>{review.comment || "No comment provided."}</p>
                    </div>
                    <p className={`shrink-0 text-xs ${muted}`}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN") : "—"}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </DataSection>
      </div>
    </main>
  );
}

function Stat({ label, value, icon, dark }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 px-4 py-4 sm:px-5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${dark ? "bg-slate-800 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>{icon}</div>
      <div className="min-w-0">
        <p className={`truncate text-lg font-extrabold ${dark ? "text-slate-100" : "text-slate-900"}`}>{value}</p>
        <p className="text-xs">{label}</p>
      </div>
    </div>
  );
}

function InfoPanel({ icon, title, subtitle, children, dark }) {
  return (
    <section className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${dark ? "border-slate-700/80 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dark ? "bg-indigo-400/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>{icon}</div>
        <div>
          <h2 className={`font-extrabold ${dark ? "text-slate-100" : "text-slate-900"}`}>{title}</h2>
          <p className={`mt-0.5 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function InfoItem({ icon, label, value, dark }) {
  return (
    <div className="min-w-0">
      <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{icon}{label}</p>
      <p className={`mt-1.5 break-words text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>{value || "—"}</p>
    </div>
  );
}

function DataSection({ icon, title, count, children, dark }) {
  return (
    <motion.section layout className={`overflow-hidden rounded-2xl border shadow-sm ${dark ? "border-slate-700/80 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
      <div className={`flex items-center gap-3 border-b px-5 py-4 sm:px-6 ${dark ? "border-slate-700 bg-slate-950/40" : "border-slate-100 bg-slate-50/70"}`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dark ? "bg-slate-800 text-indigo-300" : "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <h2 className={`font-extrabold ${dark ? "text-slate-100" : "text-slate-900"}`}>{title}</h2>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{count} {title.toLowerCase()}</p>
        </div>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{count}</span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </motion.section>
  );
}

function EmptyState({ icon, title, text, dark }) {
  return (
    <div className={`rounded-xl border border-dashed px-5 py-9 text-center ${dark ? "border-slate-700 bg-slate-950/30" : "border-slate-200 bg-slate-50/80"}`}>
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${dark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-400 shadow-sm"}`}>{icon}</div>
      <h3 className={`mt-3 font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>{title}</h3>
      <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{text}</p>
    </div>
  );
}

function Tag({ children, dark, tone = "slate" }) {
  const styles = {
    slate: dark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-100 text-slate-600",
    amber: dark ? "border-amber-400/20 bg-amber-400/10 text-amber-300" : "border-amber-200 bg-amber-50 text-amber-700",
  };
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[tone] || styles.slate}`}>{children}</span>;
}

function StatusPill({ value, dark }) {
  const status = String(value || "").toLowerCase();
  let className = dark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-100 text-slate-600";

  if (["confirm", "active", "complete", "resolve"].some((word) => status.includes(word))) {
    className = dark ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (["pending", "progress", "approved", "open"].some((word) => status.includes(word))) {
    className = dark ? "border-amber-400/20 bg-amber-400/10 text-amber-300" : "border-amber-200 bg-amber-50 text-amber-700";
  } else if (["reject", "cancel", "closed"].some((word) => status.includes(word))) {
    className = dark ? "border-red-400/20 bg-red-400/10 text-red-300" : "border-red-200 bg-red-50 text-red-700";
  }

  return <span className={`mt-2 inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-bold ${className}`}>{value}</span>;
}
