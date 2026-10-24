import React from "react";
import PropTypes from "prop-types";
import { FaGraduationCap } from "react-icons/fa";

const LoadingSpinner = ({
  size = "medium",
  color = "purple",
  text = "Finding your place...",
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-9 w-9 border-[3px]",
    large: "h-12 w-12 border-4",
    xlarge: "h-16 w-16 border-4",
  };

  const colorConfig = {
    blue: {
      ring: "border-blue-500/25 border-t-blue-600",
      accent: "text-blue-600 dark:text-blue-300",
    },
    purple: {
      ring: "border-purple-500/20 border-t-purple-600",
      accent: "text-purple-600 dark:text-purple-300",
    },
    pink: {
      ring: "border-pink-500/20 border-t-pink-600",
      accent: "text-pink-600 dark:text-pink-300",
    },
    green: {
      ring: "border-emerald-500/20 border-t-emerald-600",
      accent: "text-emerald-600 dark:text-emerald-300",
    },
    red: {
      ring: "border-red-500/20 border-t-red-600",
      accent: "text-red-600 dark:text-red-300",
    },
    indigo: {
      ring: "border-indigo-500/20 border-t-indigo-600",
      accent: "text-indigo-600 dark:text-indigo-300",
    },
    white: {
      ring: "border-white/25 border-t-white",
      accent: "text-white",
    },
  };

  const selectedColor = colorConfig[color] || colorConfig.purple;

  const spinnerElement = (
    <div
      className="flex flex-col items-center justify-center gap-4 text-center"
      role="status"
      aria-live="polite"
      aria-label={text || "Loading"}
    >
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute h-14 w-14 animate-ping rounded-full bg-purple-500/10"
        />
        <span
          aria-hidden="true"
          className="absolute h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/10 to-pink-500/10"
        />
        <span
          aria-hidden="true"
          className={`${sizeClasses[size] || sizeClasses.medium} relative block animate-spin rounded-full border-solid ${selectedColor.ring}`}
        />
        <FaGraduationCap
          aria-hidden="true"
          className={`absolute text-sm ${selectedColor.accent}`}
        />
      </div>

      {text ? (
        <div className="space-y-1">
          <p className={`text-sm font-semibold tracking-wide ${selectedColor.accent}`}>
            {text}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            StudNest · Your next stay starts here
          </p>
        </div>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white/95 px-6 backdrop-blur-xl dark:bg-slate-950/95">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-pink-400/10 blur-3xl"
        />
        <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 px-10 py-9 shadow-xl shadow-purple-900/5 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-5 flex items-center justify-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 text-white shadow-md">
              <FaGraduationCap />
            </span>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Stud<span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Nest</span>
            </span>
          </div>
          {spinnerElement}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center rounded-[inherit] bg-white/80 px-4 backdrop-blur-md dark:bg-slate-950/80">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-7 py-6 shadow-xl shadow-purple-900/5 dark:border-slate-800 dark:bg-slate-900/90">
          {spinnerElement}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-24 items-center justify-center px-4 py-8">
      {spinnerElement}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large", "xlarge"]),
  color: PropTypes.oneOf(["blue", "purple", "pink", "green", "red", "indigo", "white"]),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
};

export default LoadingSpinner;
