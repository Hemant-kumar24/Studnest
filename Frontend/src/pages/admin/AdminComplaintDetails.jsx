import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaCalendarCheck,
  FaCommentAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSave,
  FaHome,
  FaBed,
  FaTag,
} from "react-icons/fa";

import {
  getAdminComplaint,
  updateComplaint,
} from "../../services/adminComplaintService";

import ComplaintStatusBadge from "../../components/admin/ComplaintStatusBadge";

import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);

  const [status, setStatus] = useState("Open");

  const [priority, setPriority] = useState("Medium");

  const [resolution, setResolution] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD COMPLAINT
  // ==========================================

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await getAdminComplaint(id);

      const data =
        response.data?.complaint ||
        response.data?.data ||
        null;

      setComplaint(data);

      setStatus(data?.status || "Open");

      setPriority(data?.priority || "Medium");

      setResolution(data?.adminResponse || "");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // ==========================================
  // SAVE / UPDATE COMPLAINT
  // ==========================================

  const save = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await updateComplaint(id, {
        status,
        priority,
        adminResponse: resolution,
      });

      const updated =
        response.data?.complaint ||
        response.data?.data ||
        null;

      if (updated) {
        setComplaint(updated);

        setStatus(
          updated.status || status
        );

        setPriority(
          updated.priority || priority
        );

        setResolution(
          updated.adminResponse || resolution
        );
      } else {
        setComplaint((prev) => ({
          ...prev,
          status,
          priority,
          adminResponse: resolution,
        }));
      }

      setMessage(
        "Complaint updated successfully."
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

          Loading complaint...
        </div>
      </main>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!complaint) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="mb-3 flex justify-center text-red-500">
            <FaExclamationCircle className="text-2xl" />
          </div>

          <p className="font-medium text-red-700">
            {error || "Complaint not found."}
          </p>

          <Link
            to="/admin/complaints"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FaArrowLeft />

            Back to Complaints
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // NORMALIZE DATA
  // ==========================================

  const student =
    complaint.userId ||
    complaint.user ||
    complaint.student ||
    {};

  const booking =
    complaint.bookingId ||
    complaint.booking ||
    {};

  const hostel =
    complaint.hostelId ||
    complaint.hostel ||
    {};

  const room =
    complaint.roomId ||
    complaint.room ||
    {};

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <section className="mb-6">
          <Link
            to="/admin/complaints"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <FaArrowLeft />

            Back to Complaints
          </Link>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Support Case
              </p>

              <h1 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                {complaint.subject ||
                  complaint.title ||
                  "Complaint"}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Complaint ID:{" "}
                <span className="break-all font-medium text-slate-700">
                  {complaint._id}
                </span>
              </p>
            </div>

            <ComplaintStatusBadge
              status={complaint.status}
            />
          </div>
        </section>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <FaCheckCircle className="shrink-0" />

            <span>{message}</span>
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <FaExclamationCircle className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================
            STUDENT + BOOKING INFORMATION
        ====================================== */}

        <section className="grid gap-5 md:grid-cols-2">

          {/* STUDENT */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaUser />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Student
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Name"
                value={student.name || "-"}
              />

              <DetailRow
                label="Email"
                value={student.email || "-"}
              />

              <DetailRow
                label="Phone"
                value={student.phone || "-"}
              />
            </div>
          </article>

          {/* BOOKING */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FaCalendarCheck />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Booking
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                label="Booking ID"
                value={booking._id || "-"}
              />

              <DetailRow
                label="Hostel"
                value={
                  hostel.propertyTitle || "-"
                }
              />

              <DetailRow
                label="Room"
                value={
                  room.roomNumber || "-"
                }
              />

              <DetailRow
                label="Category"
                value={
                  complaint.category || "-"
                }
              />
            </div>
          </article>
        </section>

        {/* ======================================
            COMPLAINT INFORMATION
        ====================================== */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FaCommentAlt />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Student Complaint
              </h2>

              <p className="text-xs text-slate-400">
                Issue reported by the student
              </p>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4 rounded-xl bg-slate-50 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              Subject
            </p>

            <p className="font-semibold text-slate-800">
              {complaint.subject || "-"}
            </p>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Description
            </p>

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {complaint.description ||
                complaint.message ||
                "-"}
            </p>
          </div>
        </section>

        {/* ======================================
            COMPLAINT META
        ====================================== */}

        <section className="mt-5 grid gap-4 sm:grid-cols-3">

          {/* Category */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FaTag />
              </div>

              <span className="text-sm font-semibold text-slate-500">
                Category
              </span>
            </div>

            <p className="font-bold text-slate-900">
              {complaint.category ||
                "Other"}
            </p>
          </div>

          {/* Priority */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <span className="font-bold">
                  !
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-500">
                Priority
              </span>
            </div>

            <p className="font-bold text-slate-900">
              {complaint.priority ||
                "Medium"}
            </p>
          </div>

          {/* Room */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FaBed />
              </div>

              <span className="text-sm font-semibold text-slate-500">
                Room
              </span>
            </div>

            <p className="font-bold text-slate-900">
              {room.roomNumber || "-"}
            </p>
          </div>
        </section>

        {/* ======================================
            EXISTING ADMIN RESPONSE
        ====================================== */}

        {complaint.adminResponse && (
          <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">

            <div className="mb-3 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />

              <h2 className="font-bold text-emerald-900">
                Previous Admin Response
              </h2>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-emerald-800">
              {complaint.adminResponse}
            </p>

            {complaint.respondedAt && (
              <p className="mt-3 text-xs text-emerald-600">
                Responded on{" "}
                {new Date(
                  complaint.respondedAt
                ).toLocaleString("en-IN")}
              </p>
            )}
          </section>
        )}

        {/* ======================================
            MANAGE COMPLAINT
        ====================================== */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Manage Complaint
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update status, priority and
              provide a response to the
              student.
            </p>
          </div>

          <form
            onSubmit={save}
            className="space-y-5"
          >

            {/* STATUS + PRIORITY */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* STATUS */}
              <div>
                <label
                  htmlFor="complaint-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="complaint-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label
                  htmlFor="complaint-priority"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Priority
                </label>

                <select
                  id="complaint-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Urgent">
                    Urgent
                  </option>
                </select>
              </div>
            </div>

            {/* ADMIN RESPONSE */}
            <div>
              <label
                htmlFor="resolution"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Admin Response
              </label>

              <textarea
                id="resolution"
                rows={6}
                maxLength={2000}
                value={resolution}
                onChange={(e) =>
                  setResolution(
                    e.target.value
                  )
                }
                placeholder="Write a response or describe the action taken..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {resolution.length}/2000
              </p>
            </div>

            {/* SAVE */}
            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <FaSave />
                )}

                {saving
                  ? "Saving..."
                  : "Update Complaint"}
              </button>
            </div>
          </form>
        </section>

        {/* ======================================
            CREATED / UPDATED INFORMATION
        ====================================== */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 text-sm sm:grid-cols-2">

            <DetailRow
              label="Created At"
              value={
                complaint.createdAt
                  ? new Date(
                      complaint.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "-"
              }
            />

            <DetailRow
              label="Last Updated"
              value={
                complaint.updatedAt
                  ? new Date(
                      complaint.updatedAt
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "-"
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}

// ==========================================
// DETAIL ROW
// ==========================================

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="break-words font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}