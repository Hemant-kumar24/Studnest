import { Link } from "react-router-dom";
import {
  FaHeadset,
  FaCalendarAlt,
  FaHome,
  FaTag,
  FaUser,
} from "react-icons/fa";

import ComplaintStatusBadge from "./ComplaintStatusBadge";

export default function AdminComplaintCard({ complaint }) {
  const student =
    complaint?.userId ||
    complaint?.user ||
    complaint?.student ||
    {};

  const booking =
    complaint?.bookingId ||
    complaint?.booking ||
    {};

  const hostel =
    complaint?.hostelId ||
    complaint?.hostel ||
    {};

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Complaint Information */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <FaHeadset />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-lg">
                {complaint.subject || "Complaint"}
              </h2>

              <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <FaUser className="text-xs text-slate-400 dark:text-slate-500" />
                <span>Student:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {student.name || student.email || "-"}
                </span>
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <DetailTile icon={<FaHome />} label="Hostel">
              {hostel.propertyTitle || "-"}
            </DetailTile>

            <DetailTile icon={<FaTag />} label="Category">
              {complaint.category || "-"}
            </DetailTile>

            <DetailTile label="Priority">
              {complaint.priority || "Medium"}
            </DetailTile>
          </div>
        </div>

        {/* Status + Booking */}
        <div className="flex flex-col gap-3 lg:min-w-[200px] lg:items-end">
          <ComplaintStatusBadge status={complaint.status} />

          <div className="text-sm lg:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Booking
            </p>
            <p className="mt-1 break-all font-semibold text-slate-700 dark:text-slate-200">
              {booking._id || "-"}
            </p>
          </div>

          {complaint.createdAt && (
            <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <FaCalendarAlt />
              {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="border-t border-slate-100 pt-4 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Link
            to={`/admin/complaints/${complaint._id}`}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:focus-visible:ring-offset-slate-900 sm:w-auto"
          >
            View &amp; Resolve
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function DetailTile({ icon, label, children }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 transition-colors dark:border-slate-700/70 dark:bg-slate-800/70">
      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
        {icon && <span className="text-indigo-500 dark:text-indigo-400">{icon}</span>}
        <span>{label}</span>
      </div>
      <p className="mt-0.5 max-w-xs truncate font-semibold text-slate-700 dark:text-slate-100">
        {children}
      </p>
    </div>
  );
}
