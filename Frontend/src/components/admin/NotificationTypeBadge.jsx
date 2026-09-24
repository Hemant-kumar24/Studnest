import {
  FaCalendarCheck,
  FaCommentAlt,
  FaCreditCard,
  FaExclamationTriangle,
  FaBell,
} from "react-icons/fa";

const typeStyles = {
  Booking: "bg-blue-50 text-blue-700 border-blue-200",
  Payment: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Complaint: "bg-amber-50 text-amber-700 border-amber-200",
  Review: "bg-purple-50 text-purple-700 border-purple-200",
  System: "bg-slate-100 text-slate-700 border-slate-200",
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        typeStyles[value] || typeStyles.System
      }`}
    >
      <Icon />
      {value}
    </span>
  );
}
