import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaCloudUploadAlt,
  FaChartLine,
  FaCalendarCheck,
  FaExclamationCircle,
  FaStar,
  FaSignOutAlt,
  FaHome,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";
import { logout } from "../utils/auth";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = role === "admin";

  const menuItems = isAdmin
    ? [
        {
          label: "Upload Hostel",
          path: "/admindashboard/upload",
          icon: FaCloudUploadAlt,
          description: "Add accommodation",
        },
        {
          label: "Hostel Analysis",
          path: "/admindashboard/analysis",
          icon: FaChartLine,
          description: "View listing insights",
        },
      ]
    : [
        {
          label: "My Bookings",
          path: "/userdashboard/bookings",
          icon: FaCalendarCheck,
          description: "View your stays",
        },
        {
          label: "My Complaints",
          path: "/userdashboard/complaints",
          icon: FaExclamationCircle,
          description: "Track your requests",
        },
        {
          label: "My Reviews",
          path: "/userdashboard/reviews",
          icon: FaStar,
          description: "Your accommodation feedback",
        },
      ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    try {
      // Support both synchronous and asynchronous logout helpers.
      await Promise.resolve(logout());
    } finally {
      // Ensure the app's token is cleared even if the helper only handles part
      // of the logout flow. Add any other auth keys here if your app uses them.
      localStorage.removeItem("token");
      // Always return to the public home page after logout.
      navigate("/", { replace: true });
    }
  };

  return (
    <aside className="relative flex min-h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#20266f] via-[#43217f] to-[#78265f] px-4 py-5 text-white shadow-2xl shadow-indigo-950/20">
      {/* Soft background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full bg-pink-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-24 h-48 w-48 rounded-full bg-indigo-300/10 blur-3xl"
      />

      {/* Brand: always goes to the public home page */}
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go to StudNest home page"
        className="group relative mb-8 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-pink-200"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-pink-400 text-white shadow-lg shadow-black/15 transition group-hover:rotate-[-4deg]">
          <FaGraduationCap size={23} />
        </span>
        <span className="min-w-0">
          <span className="block text-xl font-black tracking-tight">
            Stud<span className="text-pink-200">Nest</span>
          </span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
            Find your place
          </span>
        </span>
        <FaChevronRight className="ml-auto text-xs text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/80" />
      </button>

      {/* Role badge */}
      <div className="relative mb-4 px-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/50">
          Workspace
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.7)]" />
          <span className="text-sm font-semibold">
            {isAdmin ? "Admin Panel" : "Student Panel"}
          </span>
          <FaShieldAlt className="ml-auto text-white/45" size={13} />
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label={`${isAdmin ? "Admin" : "Student"} navigation`} className="relative flex-1">
        <p className="mb-3 px-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/50">
          Menu
        </p>
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <motion.button
                  type="button"
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-3.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                    active
                      ? "bg-white text-indigo-900 shadow-lg shadow-black/10"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="studnest-sidebar-active"
                      className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-pink-500"
                    />
                  )}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md"
                        : "bg-white/10 text-pink-100 group-hover:bg-white/15"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{item.label}</span>
                    <span
                      className={`mt-1 block truncate text-[11px] ${
                        active ? "text-indigo-700/70" : "text-white/50"
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>
                  <FaChevronRight
                    size={10}
                    className={`shrink-0 transition-transform ${
                      active
                        ? "translate-x-0 text-indigo-700"
                        : "text-white/30 group-hover:translate-x-0.5 group-hover:text-white/80"
                    }`}
                  />
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Home shortcut */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="relative mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <FaHome size={16} />
        Back to home
        <FaArrowRightPlaceholder />
      </button>

      {/* Logout */}
      <div className="relative border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-rose-300/20 bg-rose-500/15 px-4 py-3.5 text-sm font-extrabold text-rose-100 transition duration-200 hover:border-rose-300/40 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-950/20 focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          <FaSignOutAlt className="transition-transform group-hover:-translate-x-0.5" />
          Logout
        </button>
        <p className="mt-3 text-center text-[10px] text-white/40">
          StudNest · Student accommodation
        </p>
      </div>
    </aside>
  );
};

// Small inline arrow component avoids adding another icon dependency.
const FaArrowRightPlaceholder = () => (
  <span aria-hidden="true" className="ml-auto text-xs opacity-50">→</span>
);

export default Sidebar;
