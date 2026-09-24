// src/components/Sidebar.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const menuItems =
    role === "admin"
      ? [
          {
            label: "Upload Hostel",
            path: "/admindashboard/upload",
          },
          {
            label: "Hostel Analysis",
            path: "/admindashboard/analysis",
          },
        ]
      : [
          {
            label: "My Bookings",
            path: "/userdashboard/bookings",
          },
          {
            label: "My Complaints",
            path: "/userdashboard/complaints",
          },
          {
            label: "My Reviews",
            path: "/userdashboard/reviews",
          },
        ];

  return (
    <div
      className="
        w-64 h-screen
        bg-white/20 dark:bg-gray-800/30
        backdrop-blur-xl
        border-r border-gray-300 dark:border-gray-700
        shadow-xl
        p-6
        flex flex-col
      "
    >
      {/* StudNest Logo */}
      <h2
        className="
          text-3xl font-extrabold
          text-purple-700 dark:text-purple-300
          mb-8
          cursor-pointer
          hover:scale-105
          transition-transform
        "
        onClick={() => navigate("/")}
      >
        StudNest 🏠
      </h2>

      {/* Menu */}
      <ul className="space-y-3 flex-1">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="
              px-4 py-3
              rounded-lg
              cursor-pointer
              text-gray-900 dark:text-gray-100
              hover:bg-purple-600
              hover:text-white
              transition-all
              duration-300
              shadow-sm
            "
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={logout}
        className="
          mt-auto
          w-full
          bg-red-500 dark:bg-red-600
          hover:bg-red-600 dark:hover:bg-red-700
          text-white
          font-semibold
          px-4 py-3
          rounded-xl
          shadow-md
          transition-all
        "
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;