import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminNotificationBell from "../components/admin/AdminNotificationBell";
import {
  FaGraduationCap,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaHotel,
  FaBed,
  FaCalendarCheck,
  FaCreditCard,
  FaExclamationCircle,
  FaStar,
  FaBell,
  FaCog,
  FaUserShield,
  FaChevronRight,
} from "react-icons/fa";

const items = [
  ["Dashboard", "/admin/dashboard", FaTachometerAlt],
  ["Students", "/admin/students", FaUsers],
  ["Hostels", "/admin/hostels", FaHotel],
  ["Rooms", "/admin/rooms", FaBed],
  ["Bookings", "/admin/bookings", FaCalendarCheck],
  ["Payments", "/admin/payments", FaCreditCard],
  ["Complaints", "/admin/complaints", FaExclamationCircle],
  ["Reviews", "/admin/reviews", FaStar],
  ["Notifications", "/admin/notifications", FaBell],
  ["System Settings", "/admin/settings", FaCog],
  ["Admin Profile", "/admin/profile", FaUserShield],
];

const getSavedTheme = () =>
  localStorage.getItem("theme") === "dark" ? "dark" : "light";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => getSavedTheme() === "dark");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const syncTheme = () => {
      const theme = getSavedTheme();
      setDarkMode(theme === "dark");
      document.documentElement.classList.toggle("dark", theme === "dark");
    };

    syncTheme();
    window.addEventListener("studnest-theme-changed", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("studnest-theme-changed", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleThemeToggle = () => {
    const nextTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setDarkMode(nextTheme === "dark");
    window.dispatchEvent(new Event("studnest-theme-changed"));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      ["token", "authToken", "accessToken", "refreshToken", "adminToken"].forEach(
        (key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        }
      );
      navigate("/", { replace: true });
    }
  };

  const renderLinks = () =>
    items.map(([label, to, Icon]) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/admin/dashboard"}
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) =>
          `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            isActive
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-900/20"
              : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700 dark:group-hover:text-indigo-300"
              }`}
            >
              <Icon size={15} />
            </span>
            <span className="min-w-0 flex-1">{label}</span>
            {isActive && <FaChevronRight size={10} />}
          </>
        )}
      </NavLink>
    ));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Same top header structure and gradient as StudentLayout */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-[#20266f] via-[#552184] to-[#8f245f] text-white shadow-lg shadow-indigo-950/15">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <NavLink
              to="/"
              aria-label="StudNest home"
              className="group inline-flex items-center gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 transition group-hover:rotate-[-4deg]">
                <FaGraduationCap size={21} />
              </span>
              <span>
                <span className="block text-xl font-black tracking-tight">
                  Stud<span className="text-pink-200">Nest</span>
                </span>
                <span className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60 sm:block">
                  Admin workspace
                </span>
              </span>
            </NavLink>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AdminNotificationBell />
            <NavLink
              to="/admin/profile"
              aria-label="Admin profile"
              className="hidden items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white sm:inline-flex"
            >
              <FaUserShield />
              <span>Profile</span>
            </NavLink>
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-amber-200 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              <FaSignOutAlt size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar — same dimensions and visual style as student sidebar */}
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:flex">
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white shadow-lg shadow-indigo-900/15">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Admin workspace</p>
            <p className="mt-2 text-lg font-bold">Manage StudNest.</p>
            <p className="mt-1 text-xs leading-5 text-white/75">
              Monitor students, listings and platform activity.
            </p>
          </div>

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Administration
          </p>
          <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
            {renderLinks()}
          </nav>

          <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">StudNest control center</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Manage the platform from one place.
            </p>
          </div>
        </aside>

        {/* Mobile overlay and drawer */}
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] md:hidden"
          />
        )}
        <aside
          aria-label="Mobile admin sidebar"
          aria-hidden={!mobileMenuOpen}
          className={`fixed bottom-0 left-0 top-0 z-50 flex w-[min(84vw,320px)] flex-col border-r border-slate-200 bg-white p-4 pt-20 shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Admin workspace</p>
            <p className="mt-2 text-lg font-bold">Welcome to StudNest</p>
          </div>
          <nav aria-label="Mobile admin navigation" className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
            {renderLinks()}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
          >
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        {/* Same content alignment/padding as StudentLayout */}
        <main className="min-w-0 flex-1 p-4 transition-colors duration-300 sm:p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
