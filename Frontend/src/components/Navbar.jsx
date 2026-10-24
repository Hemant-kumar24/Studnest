import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserPlus,
  FaUserCircle,
  FaArrowRight,
  FaHome,
  FaInfoCircle,
  FaGraduationCap,
  FaCompass,
} from "react-icons/fa";

const getTokenPayload = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const getUserRole = (payload) => {
  const role = payload?.role ?? payload?.userType ?? payload?.type;
  if (typeof role !== "string") return "student";
  const normalized = role.toLowerCase();
  if (normalized === "admin") return "admin";
  if (["student", "user"].includes(normalized)) return "student";
  return "student";
};

const getDashboardPath = (user) =>
  getUserRole(user) === "admin" ? "/admin/dashboard" : "/student/dashboard";

// Clear common client-side authentication keys from both browser storage areas.
const clearClientAuth = () => {
  const authKeys = [
    "token",
    "authToken",
    "accessToken",
    "refreshToken",
    "user",
    "currentUser",
    "role",
    "userRole",
    "adminToken",
    "studentToken",
  ];

  authKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const syncAuthState = () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const payload = getTokenPayload(token);
      setUser(payload);

      if (token && !payload) {
        clearClientAuth();
      }
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("studnest-auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("studnest-auth-changed", syncAuthState);
    };
  }, [location.pathname]);

  useEffect(() => {
    closeMenu();
    closeModal();
  }, [location.pathname, closeMenu, closeModal]);

  useEffect(() => {
    if (!menuOpen && !showModal) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, showModal, closeMenu, closeModal]);

  const handleLogout = () => {
    // Clear credentials before navigating so protected pages cannot reuse a stale token.
    clearClientAuth();
    setUser(null);
    closeMenu();
    closeModal();

    // Notify other components that depend on authentication state.
    window.dispatchEvent(new Event("studnest-auth-changed"));

    // replace prevents the browser Back button from returning to the dashboard history entry.
    navigate("/", { replace: true });
  };

  const handleRegistration = (path) => {
    closeModal();
    closeMenu();
    navigate(path);
  };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const desktopLinkClass = (path) =>
    `relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
      isActive(path)
        ? "bg-white text-indigo-800 shadow-md shadow-indigo-950/10"
        : "text-white/85 hover:bg-white/15 hover:text-white"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
      isActive(path)
        ? "bg-white text-indigo-800 shadow-sm"
        : "text-white/90 hover:bg-white/10"
    }`;

  const dashboardPath = user ? getDashboardPath(user) : "/userdashboard";

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <nav
          aria-label="Main navigation"
          className="w-full border-b border-white/15 bg-gradient-to-r from-[#20266f] via-[#552184] to-[#8f245f] text-white shadow-lg shadow-indigo-950/15 backdrop-blur-xl"
        >
          <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              onClick={closeMenu}
              aria-label="StudNest home"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner ring-1 ring-white/20 transition group-hover:rotate-[-4deg] group-hover:bg-white/20">
                <FaGraduationCap size={21} />
              </span>
              <span className="leading-none">
                <span className="block text-[1.55rem] font-black tracking-tight">
                  Stud<span className="text-pink-200">Nest</span>
                </span>
                <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65 sm:block">
                  Find your place
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/10 p-1 md:flex">
              <Link to="/" className={desktopLinkClass("/")}>
                <FaHome size={14} /> Home
              </Link>
              <Link to="/about" className={desktopLinkClass("/about")}>
                <FaInfoCircle size={14} /> About
              </Link>
              <Link to="/explore" className={desktopLinkClass("/explore")}>
                <FaCompass size={14} /> Explore
              </Link>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
                  >
                    <FaUserCircle size={17} /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    <FaSignOutAlt size={14} /> Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-indigo-800 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <FaUserPlus size={14} /> Get started
                  <FaArrowRight className="transition-transform group-hover:translate-x-0.5" size={12} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-amber-200 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-amber-200 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="studnest-mobile-navigation"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="studnest-mobile-navigation"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden border-t border-white/10 md:hidden"
              >
                <div className="space-y-2 px-4 py-4 sm:px-6">
                  <Link to="/" onClick={closeMenu} className={mobileLinkClass("/")}>
                    <FaHome /> Home
                  </Link>
                  <Link to="/about" onClick={closeMenu} className={mobileLinkClass("/about")}>
                    <FaInfoCircle /> About
                  </Link>
                  <Link to="/explore" onClick={closeMenu} className={mobileLinkClass("/explore")}>
                    <FaCompass /> Explore hostels
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to={dashboardPath}
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-semibold transition hover:bg-white/15"
                      >
                        <FaUserCircle /> My dashboard <FaArrowRight className="ml-auto" />
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl bg-rose-500 px-4 py-3.5 text-sm font-bold transition hover:bg-rose-600"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        setShowModal(true);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 font-extrabold text-indigo-800 shadow-md transition hover:bg-pink-50"
                    >
                      <FaUserPlus /> Get started <FaArrowRight size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4">
            <motion.button
              type="button"
              aria-label="Close account selection dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="registration-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:p-8"
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FaTimes />
              </button>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 text-white shadow-lg">
                <FaGraduationCap size={25} />
              </div>
              <h2 id="registration-modal-title" className="text-center text-2xl font-black">
                Welcome to StudNest
              </h2>
              <p className="mt-2 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose how you want to continue.
              </p>
              <div className="mt-7 space-y-3">
                <button
                  type="button"
                  onClick={() => handleRegistration("/user/register")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <FaUserCircle size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">Continue as Student</span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      Explore stays and manage your account.
                    </span>
                  </span>
                  <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRegistration("/admin/login")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-pink-400 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                    <FaUserPlus size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">Admin login</span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      Sign in to the administrator account.
                    </span>
                  </span>
                  <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-pink-600" />
                </button>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Maybe later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
