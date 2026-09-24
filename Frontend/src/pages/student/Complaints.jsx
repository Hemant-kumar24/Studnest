import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaPlus, FaHeadset, FaArrowRight } from "react-icons/fa";
import { getMyComplaints, deleteComplaint } from "../../services/complaintService";
import { getApiErrorMessage } from "../../utils/apiError";

const statusStyles = {
  Open: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true); setError("");
      const response = await getMyComplaints({ page: 1, limit: 50 });
      setComplaints(response.data?.complaints || response.data?.data || []);
    } catch (err) { setError(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await deleteComplaint(id);
      setComplaints((items) => items.filter((item) => item._id !== id));
    } catch (err) { setError(getApiErrorMessage(err)); }
  };

  return <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Student Support</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Complaints</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">Raise an issue, track its progress, and see responses from the StudNest team.</p>
        </div>
        <Link to="/student/complaints/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl">
          <FaPlus /> Raise Complaint
        </Link>
      </section>

      {error && <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"><FaExclamationCircle className="mt-0.5 shrink-0" />{error}</div>}

      {loading ? <div className="grid gap-4">{[1,2,3].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-900" />)}</div> : complaints.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"><FaHeadset /></div>
          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">No complaints yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">If something is wrong with your stay, create a complaint and we’ll help you track it.</p>
          <Link to="/student/complaints/create" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Create your first complaint <FaArrowRight className="text-xs" /></Link>
        </div>
      ) : <section className="space-y-4">{complaints.map((complaint) => {
        const hostel = complaint.hostelId || complaint.hostel || {};
        const status = complaint.status || "Open";
        return <article key={complaint._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"><FaHeadset /></div>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-slate-900 dark:text-white">{complaint.subject || complaint.title || "Complaint"}</h2><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>{status}</span></div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{complaint.category || "General"}{hostel.propertyTitle ? ` • ${hostel.propertyTitle}` : ""}</p></div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{complaint.description || complaint.message || "No description provided."}</p>
              {complaint.adminResponse && <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20"><p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Admin response</p><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{complaint.adminResponse}</p></div>}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:items-end"><span className="text-xs text-slate-400">{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : ""}</span><button onClick={() => remove(complaint._id)} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20">Delete</button></div>
          </div>
        </article>;
      })}</section>}
    </div>
  </main>;
}
