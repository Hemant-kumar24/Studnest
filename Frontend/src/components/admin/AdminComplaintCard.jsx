import { Link } from "react-router-dom";
import {
  FaHeadset,
  FaCalendarAlt,
  FaHome,
  FaTag,
  FaUser,
} from "react-icons/fa";

import ComplaintStatusBadge from "./ComplaintStatusBadge";

export default function AdminComplaintCard({
  complaint,
}) {
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
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Complaint Information */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FaHeadset />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                {complaint.subject ||
                  "Complaint"}
              </h2>

              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <FaUser className="text-xs text-slate-400" />

                Student:

                <span className="font-medium text-slate-700">
                  {student.name ||
                    student.email ||
                    "-"}
                </span>
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">

            {/* Hostel */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-1 text-slate-400">
                <FaHome />
                <span>
                  Hostel
                </span>
              </div>

              <p className="mt-0.5 max-w-xs truncate font-semibold text-slate-700">
                {hostel.propertyTitle ||
                  "-"}
              </p>
            </div>

            {/* Category */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-1 text-slate-400">
                <FaTag />
                <span>
                  Category
                </span>
              </div>

              <p className="mt-0.5 font-semibold text-slate-700">
                {complaint.category ||
                  "-"}
              </p>
            </div>

            {/* Priority */}
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-400">
                Priority
              </span>

              <p className="mt-0.5 font-semibold text-slate-700">
                {complaint.priority ||
                  "Medium"}
              </p>
            </div>
          </div>
        </div>

        {/* Status + Booking */}
        <div className="flex flex-col gap-3 lg:min-w-[200px] lg:items-end">

          <ComplaintStatusBadge
            status={complaint.status}
          />

          <div className="text-sm lg:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Booking
            </p>

            <p className="mt-1 break-all font-semibold text-slate-700">
              {booking._id ||
                "-"}
            </p>
          </div>

          {complaint.createdAt && (
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <FaCalendarAlt />

              {new Date(
                complaint.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Link
            to={`/admin/complaints/${complaint._id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            View & Resolve
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}