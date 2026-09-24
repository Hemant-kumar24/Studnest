import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/axios";
import ButtonLoader from "../../components/ButtonLoader";
import { useAuth } from "../../context/AuthContext";
import loginBg from "/hostel_background_image.jpeg";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/student/login", formData);

      const token =
        res.data?.token ||
        res.data?.data?.token;

      const user =
        res.data?.user ||
        res.data?.data?.user;

      if (!token) {
        throw new Error("Authentication token not received");
      }

      login({
        token,
        user: {
          ...(user || {}),
          role: "student",
        },
      });

      toast.success("Login successful!", {
        duration: 1500,
      });

      setTimeout(() => {
        navigate(
          location.state?.from?.pathname ||
            "/student/dashboard",
          {
            replace: true,
          }
        );
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login failed",
        {
          duration: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <Toaster position="top-center" />

      <motion.div
        initial={{
          y: 50,
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="w-full max-w-md rounded-3xl border border-white/30 bg-white/20 p-10 text-white shadow-2xl backdrop-blur-2xl"
      >
        <motion.h2
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mb-8 text-center text-3xl font-bold drop-shadow"
        >
          🔐 Student Login
        </motion.h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.3,
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-white/80 px-5 py-3 text-lg text-gray-800 shadow-inner placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-400"
            />
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="relative"
          >
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-white/80 px-5 py-3 pr-12 text-lg text-gray-800 shadow-inner placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: loading ? 1 : 1.03,
            }}
            whileTap={{
              scale: loading ? 1 : 0.97,
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ${
              loading
                ? "cursor-not-allowed opacity-75"
                : ""
            }`}
          >
            {loading ? (
              <>
                <ButtonLoader
                  size="small"
                  color="white"
                />
                Logging in...
              </>
            ) : (
              "🚀 Login Now"
            )}
          </motion.button>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
            className="pt-4 text-center text-sm text-white drop-shadow"
          >
            Don't have an account?{" "}
            <span
              onClick={() =>
                navigate("/user/register")
              }
              className="cursor-pointer underline transition hover:text-indigo-200"
            >
              Register here
            </span>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default UserLogin;