import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auth token hydration
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (e) {
        setUser(null);
      }
    }

    // Theme hydration (persist across pages/reloads)
    const storedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = storedTheme ? storedTheme === "dark" : prefersDark;

    setDarkMode(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#1f267e] via-[#551a8b] to-[#91114b] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              onClick={() => navigate("/")}
              className="text-3xl font-extrabold tracking-wider cursor-pointer hover:opacity-90"
            >
              <span className="text-pink-300 drop-shadow-md">Stud</span>
              <span className="text-yellow-300 drop-shadow-md">Nest</span>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="hover:text-yellow-200 font-medium">
                Home
              </Link>
              <Link to="/about" className="hover:text-yellow-200 font-medium">
                About
              </Link>
              

              {user ? (
                <>
                  <Link
                    to="/userdashboard"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md"
                  >
                    <FaUserCircle />
                    My Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-5 py-2 rounded-full font-semibold shadow-md transition-all"
                >
                  <FaUserPlus />
                  Register
                </button>
              )}

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-indigo-900 px-6 py-4 space-y-3"
            >
              <Link
                to="/"
                className="block w-full text-left text-white hover:text-yellow-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block w-full text-left text-white hover:text-yellow-200"
              >
                About
              </Link>
              

              {user ? (
                <>
                  <Link
                    to="/userdashboard"
                    className="w-full block  text-white py-2 rounded-full text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUserCircle className="inline mr-1" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full  text-white py-2 rounded-full"
                  >
                    <FaSignOutAlt className="inline mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white py-2 rounded-full"
                >
                  <FaUserPlus className="inline mr-1" />
                  Register
                </button>
              )}

              <button onClick={toggleDarkMode} className="text-white">
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white p-6 rounded-xl w-80 space-y-4 text-center shadow-lg">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  Continue As
                </h3>
                <button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded hover:from-indigo-600 hover:to-purple-700 transition"
                  onClick={() => {
                    navigate("/user/register");
                    setShowModal(false);
                  }}
                >
                  User
                </button>
                <button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded hover:from-pink-600 hover:to-purple-700 transition"
                  onClick={() => {
                    navigate("/admin/register");
                    setShowModal(false);
                  }}
                >
                  Admin
                </button>
                <button
                  className="text-sm text-gray-500 hover:underline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
