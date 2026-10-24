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

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const response = await getAdminComplaint(id);
      const data = response.data?.complaint || response.data?.data || null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      const updated = response.data?.complaint || response.data?.data || null;

      if (updated) {
        setComplaint(updated);
        setStatus(updated.status || status);
        setPriority(updated.priority || priority);
        setResolution(updated.adminResponse || resolution);
      } else {
        setComplaint((prev) => ({
          ...prev,
          status,
          priority,
          adminResponse: resolution,
        }));
      }
      setMessage("Complaint updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          Loading complaint...
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-8 transition-colors dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <div className="mb-3 flex justify-center text-red-500">
            <FaExclamationCircle className="text-2xl" />
          </div>
          <p className="font-medium text-red-700 dark:text-red-300">
            {error || "Complaint not found."}
          </p>
          <Link
            to="/admin/complaints"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <FaArrowLeft />
            Back to Complaints
          </Link>
        </div>
      </main>
    );
  }

  const student = complaint.userId || complaint.user || complaint.student || {};
  const booking = complaint.bookingId || complaint.booking || {};
  const hostel = complaint.hostelId || complaint.hostel || {};
  const room = complaint.roomId || complaint.room || {};

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-6">
          <Link
            to="/admin/complaints"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300"
          >
            <FaArrowLeft />
            Back to Complaints
          </Link>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Support Case
              </p>
              <h1 className="break-words text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                {complaint.subject || complaint.title || "Complaint"}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Complaint ID:{" "}
                <span className="break-all font-medium text-slate-700 dark:text-slate-200">
                  {complaint._id}
                </span>
              </p>
            </div>
            <ComplaintStatusBadge status={complaint.status} />
          </div>
        </section>

        {message && (
          <div role="status" className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            <FaCheckCircle className="shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2">
          <InfoCard title="Student" icon={<FaUser />} iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <DetailRow label="Name" value={student.name || "-"} />
            <DetailRow label="Email" value={student.email || "-"} />
            <DetailRow label="Phone" value={student.phone || "-"} />
          </InfoCard>

          <InfoCard title="Booking" icon={<FaCalendarCheck />} iconClass="bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300">
            <DetailRow label="Booking ID" value={booking._id || "-"} />
            <DetailRow label="Hostel" value={hostel.propertyTitle || "-"} />
            <DetailRow label="Room" value={room.roomNumber || "-"} />
            <DetailRow label="Category" value={complaint.category || "-"} />
          </InfoCard>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
              <FaCommentAlt />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Student Complaint</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Issue reported by the student</p>
            </div>
          </div>

          <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Subject</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{complaint.subject || "-"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Description</p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
              {complaint.description || complaint.message || "-"}
            </p>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <MetaCard title="Category" icon={<FaTag />} iconClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" value={complaint.category || "Other"} />
          <MetaCard title="Priority" icon={<span className="font-bold">!</span>} iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" value={complaint.priority || "Medium"} />
          <MetaCard title="Room" icon={<FaBed />} iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300" value={room.roomNumber || "-"} />
        </section>

        {complaint.adminResponse && (
          <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition-colors dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-emerald-900 dark:text-emerald-200">Previous Admin Response</h2>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-emerald-800 dark:text-emerald-100">
              {complaint.adminResponse}
            </p>
            {complaint.respondedAt && (
              <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-300">
                Responded on {new Date(complaint.respondedAt).toLocaleString("en-IN")}
              </p>
            )}
          </section>
        )}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Complaint</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update status, priority and provide a response to the student.
            </p>
          </div>

          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="complaint-status" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Status
                </label>
                <select
                  id="complaint-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label htmlFor="complaint-priority" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Priority
                </label>
                <select
                  id="complaint-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="resolution" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Admin Response
              </label>
              <textarea
                id="resolution"
                rows={6}
                maxLength={2000}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Write a response or describe the action taken..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
              />
              <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">{resolution.length}/2000</p>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:w-auto"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <FaSave />
                )}
                {saving ? "Saving..." : "Update Complaint"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <DetailRow
              label="Created At"
              value={complaint.createdAt ? new Date(complaint.createdAt).toLocaleString("en-IN") : "-"}
            />
            <DetailRow
              label="Last Updated"
              value={complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleString("en-IN") : "-"}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, icon, iconClass, children }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-3 text-sm">{children}</div>
    </article>
  );
}

function MetaCard({ title, icon, iconClass, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>{icon}</div>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</span>
      </div>
      <p className="break-words font-bold text-slate-900 dark:text-white">{value}</p>
    </article>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
      <span className="break-words font-medium text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}
