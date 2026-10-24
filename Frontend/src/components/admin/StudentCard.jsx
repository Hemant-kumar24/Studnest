import React from "react";
import StudentStatusBadge from "./StudentStatusBadge";

export default function StudentCard({ student, onView }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 sm:p-5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold text-slate-900 dark:text-slate-100">
            {student.name || "Unnamed Student"}
          </h3>
          <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
            {student.email || "—"}
          </p>
        </div>
        <StudentStatusBadge active={student.isActive !== false} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Phone
          </span>
          <p className="mt-1 break-words text-slate-800 dark:text-slate-200">
            {student.phone || "—"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            College
          </span>
          <p className="mt-1 break-words text-slate-800 dark:text-slate-200">
            {student.college || "—"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            City
          </span>
          <p className="mt-1 break-words text-slate-800 dark:text-slate-200">
            {student.city || student.location?.city || "—"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Joined
          </span>
          <p className="mt-1 break-words text-slate-800 dark:text-slate-200">
            {student.createdAt
              ? new Date(student.createdAt).toLocaleDateString("en-IN")
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onView(student._id)}
          className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-indigo-400/30 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-400/10"
        >
          View Student
        </button>
      </div>
    </article>
  );
}
