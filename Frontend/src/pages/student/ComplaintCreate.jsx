import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { createComplaint } from "../../services/complaintService";
import { getMyBookings } from "../../services/studentDashboardService";
import { getApiErrorMessage } from "../../utils/apiError";

const categories = ["Room","Food","Cleanliness","Maintenance","Electricity","Water","Security","Staff","Payment","Other"];

export default function ComplaintCreate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId") || "";
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ bookingId, subject: "", category: "Maintenance", priority: "Medium", description: "" });
  const [loading, setLoading] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBookings({ page: 1, limit: 50 }).then((res) => setBookings(res.data?.data || res.data?.bookings || [])).catch(() => {}).finally(() => setLoadingBookings(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) { setError("Please provide a subject and description."); return; }
    if (!form.bookingId) { setError("Please select the booking related to this complaint."); return; }
    try { setLoading(true); setError(""); await createComplaint({ ...form, subject: form.subject.trim(), description: form.description.trim() }); navigate("/student/complaints"); }
    catch (err) { setError(getApiErrorMessage(err)); } finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl">
    <Link to="/student/complaints" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400"><FaArrowLeft className="text-xs" /> Back to complaints</Link>
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-indigo-100">Student Support</p><h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Raise a Complaint</h1><p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">Tell us what happened. Include enough detail for the team to resolve the issue quickly.</p></div>
      <form onSubmit={submit} className="space-y-6 p-6 sm:p-8">
        {error && <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"><FaExclamationTriangle className="mt-0.5" />{error}</div>}
        <div><label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Related Booking</label><select value={form.bookingId} onChange={(e)=>setForm({...form,bookingId:e.target.value})} disabled={loadingBookings} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option value="">{loadingBookings ? "Loading bookings..." : "Select a booking"}</option>{bookings.map((b)=><option key={b._id} value={b._id}>{b.hostelId?.propertyTitle || b.hostel?.propertyTitle || "Hostel"} {b.roomId?.roomNumber ? `• Room ${b.roomId.roomNumber}` : ""} • {b.status || "Booking"}</option>)}</select></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Category</label><select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">{categories.map(c=><option key={c}>{c}</option>)}</select></div><div><label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Priority</label><select value={form.priority} onChange={(e)=>setForm({...form,priority:e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div></div>
        <div><label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label><input required value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} maxLength={150} placeholder="e.g. Water supply issue in room" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
        <div><div className="mb-2 flex justify-between"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label><span className="text-xs text-slate-400">{form.description.length}/2000</span></div><textarea required rows={7} maxLength={2000} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Describe the issue, when it started, and anything the support team should know..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link to="/student/complaints" className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</Link><button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">{loading ? "Submitting..." : <><FaCheckCircle /> Submit Complaint</>}</button></div>
      </form>
    </section>
  </div></main>;
}
