
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonLoader from "../../components/ButtonLoader";
import api from "../../api/axios";
import backgroundImage from "/hostel_background_image.jpeg";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Required fields
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      toast.error(
        "Password must have 6+ characters with letters & numbers"
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Correct backend endpoint
      const response = await api.post("/auth/student/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // Save token if backend returns one
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save user if backend returns one
      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      toast.success(
        response.data?.message || "Registration successful!",
        {
          duration: 1500,
        }
      );

      // Redirect to login
      setTimeout(() => {
        navigate("/user/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Registration failed",
        {
          duration: 2500,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-cover
        bg-center
        flex
        justify-center
        items-center
        px-4
        dark:bg-gray-900
      "
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Toaster position="top-center" />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          w-full
          max-w-md
          p-10
          rounded-3xl
          backdrop-blur-2xl
          bg-white/20
          dark:bg-black/30
          border
          border-white/30
          shadow-xl
          text-white
        "
      >
        {/* Heading */}
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
          className="
            text-3xl
            font-bold
            text-center
            mb-8
            drop-shadow
          "
        >
          📝 Student Registration
        </motion.h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name */}
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
              type="text"
              name="name"
              placeholder="👤 Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="
                input-modern
                w-full
                bg-white/80
                dark:bg-gray-800/80
                text-gray-800
                rounded-xl
                px-5
                py-3
                shadow-inner
                focus:outline-none
                focus:ring-4
                focus:ring-purple-400
                disabled:opacity-60
              "
            />
          </motion.div>

          {/* Email */}
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
              delay: 0.35,
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="📧 Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="
                input-modern
                w-full
                bg-white/80
                dark:bg-gray-800/80
                text-gray-800
                rounded-xl
                px-5
                py-3
                shadow-inner
                focus:outline-none
                focus:ring-4
                focus:ring-purple-400
                disabled:opacity-60
              "
            />
          </motion.div>

          {/* Password */}
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
              delay: 0.4,
            }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="
                input-modern
                w-full
                bg-white/80
                dark:bg-gray-800/80
                text-gray-800
                rounded-xl
                px-5
                py-3
                pr-12
                shadow-inner
                focus:outline-none
                focus:ring-4
                focus:ring-purple-400
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              disabled={loading}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-700
                dark:text-gray-300
              "
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </motion.div>

          {/* Confirm Password */}
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
              delay: 0.45,
            }}
          >
            <input
              type="password"
              name="confirmPassword"
              placeholder="🔒 Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="
                input-modern
                w-full
                bg-white/80
                dark:bg-gray-800/80
                text-gray-800
                rounded-xl
                px-5
                py-3
                shadow-inner
                focus:outline-none
                focus:ring-4
                focus:ring-purple-400
                disabled:opacity-60
              "
            />
          </motion.div>

          {/* Password information */}
          <p className="text-xs text-white/80 text-center">
            Password must contain at least 6 characters,
            including letters and numbers.
          </p>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: loading ? 1 : 1.03,
            }}
            whileTap={{
              scale: loading ? 1 : 0.97,
            }}
            className={`
              w-full
              py-3
              rounded-xl
              bg-gradient-to-r
              from-green-500
              via-blue-600
              to-purple-500
              text-white
              font-semibold
              text-lg
              shadow-lg
              transition-all
              flex
              items-center
              justify-center
              gap-2
              ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-purple-500/40"
              }
            `}
          >
            {loading ? (
              <>
                <ButtonLoader
                  size="small"
                  color="white"
                />
                Registering...
              </>
            ) : (
              "🚀 Register Now"
            )}
          </motion.button>

          {/* Login */}
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
            className="
              text-sm
              text-center
              pt-3
            "
          >
            Already have an account?{" "}
            <span
              onClick={() =>
                navigate("/user/login")
              }
              className="
                underline
                cursor-pointer
                hover:text-green-300
                transition
              "
            >
              Login here
            </span>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default UserRegister;
