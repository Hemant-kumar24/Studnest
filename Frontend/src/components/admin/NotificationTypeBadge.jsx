import React from "react";
import {
  FaCalendarCheck,
  FaCommentAlt,
  FaCreditCard,
  FaExclamationTriangle,
  FaBell,
} from "react-icons/fa";

const typeStyles = {
  Booking:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300",
  Payment:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
  Complaint:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  Review:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-400/30 dark:bg-purple-400/10 dark:text-purple-300",
  System:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-700/60 dark:text-slate-300",
};

const icons = {
  Booking: FaCalendarCheck,
  Payment: FaCreditCard,
  Complaint: FaExclamationTriangle,
  Review: FaCommentAlt,
  System: FaBell,
};

export default function NotificationTypeBadge({ type }) {
  const value = type || "System";
  const Icon = icons[value] || FaBell;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
        typeStyles[value] || typeStyles.System
      }`}
    >
      <Icon className="shrink-0" aria-hidden="true" />
      <span>{value}</span>
    </span>
  );
}
