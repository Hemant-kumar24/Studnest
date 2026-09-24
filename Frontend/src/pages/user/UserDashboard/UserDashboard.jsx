import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBookmark,
  FaStar,
  FaBell,
  FaLifeRing,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";

const SIDEBAR_WIDTH = 256; // 64 * 4 = 256px (Tailwind w-64)

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { name: "Overview", path: "/userdashboard", icon: <FaHome /> },
    { name: "Favorites", path: "/userdashboard/favorites", icon: <FaBookmark /> },
    { name: "My Reviews", path: "/userdashboard/my-reviews", icon: <FaStar /> },
    { name: "Notifications", path: "/userdashboard/notifications", icon: <FaBell /> },
    { name: "Support", path: "/userdashboard/support", icon: <FaLifeRing /> },
  ];

  const dynamicTitle =
    {
      "/userdashboard": "Overview",
      "/userdashboard/favorites": "Favorites",
      "/userdashboard/my-reviews": "My Reviews",
      "/userdashboard/notifications": "Notifications",
      "/userdashboard/support": "Support",
    }[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* ================= NAVBAR (not behind sidebar) ================= */}
      <header
        className={`fixed top-0 h-16 flex items-center justify-between px-6 
        bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 z-50 shadow-sm
        w-[calc(100%-${SIDEBAR_WIDTH}px)] 
        left-${SIDEBAR_WIDTH}px
        lg:left-[${SIDEBAR_WIDTH}px]
        lg:w-[calc(100%-${SIDEBAR_WIDTH}px)]
        ${!isSidebarOpen ? "left-0 w-full lg:left-[256px] lg:w-[calc(100%-256px)]" : ""}
        `}
        style={{ left: window.innerWidth >= 1024 ? `${SIDEBAR_WIDTH}px` : "0px" }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-xl lg:hidden"
          >
            <FaBars />
          </button>

          <h1 className="text-xl font-bold tracking-wide">{dynamicTitle}</h1>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      {/* ============== SIDEBAR ================= */}
      <aside
  className={`fixed top-0 left-0 w-64 h-screen
  bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700
  p-5 shadow-md transition-all duration-300 z-40
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
>
  <Link to="/" className="block mb-6 mt-16"> 
    {/* Add margin-top to NOT hide under navbar */}
    <h2 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 hover:opacity-80">
      StudNest 🏠
    </h2>
  </Link>

  <nav className="space-y-3">
    {menuItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className={`flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-medium transition-all 
          ${
            location.pathname === item.path
              ? "bg-purple-600 text-white shadow scale-[1.02]"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
      >
        {item.icon}
        <span>{item.name}</span>
      </Link>
    ))}
  </nav>

  <motion.button
    whileTap={{ scale: 0.96 }}
    onClick={handleLogout}
    className="w-full flex items-center justify-center gap-3 
    mt-6 px-4 py-3 rounded-lg 
    bg-gradient-to-r from-red-500 to-red-700 
    text-white font-semibold shadow-lg 
    hover:from-red-600 hover:to-red-800 transition-all"
  >
    <FaSignOutAlt />
    Logout
  </motion.button>
</aside>


      {/* ================= CONTENT AREA ================= */}
      <main
  className="pt-20 p-6 overflow-y-auto"
  style={{ marginLeft: "256px" }}
>
  <Outlet />
</main>

    </div>
  );
};

export default UserDashboard;
