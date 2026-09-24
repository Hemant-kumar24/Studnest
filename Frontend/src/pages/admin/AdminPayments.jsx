import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminPaymentService from "../../services/adminPaymentService";
import PaymentCard from "../../components/admin/PaymentCard";

const tabs = ["All", "Successful", "Pending", "Failed", "Refunded"];

export default function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10 };
      if (status !== "All") params.status = status;
      if (search.trim()) params.search = search.trim();

      const [paymentRes, summaryRes] = await Promise.all([
        adminPaymentService.getPayments(params),
        adminPaymentService.getRevenueSummary(),
      ]);

      setPayments(paymentRes.data || paymentRes.payments || []);
      setSummary(summaryRes.data || summaryRes || {});
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status, page]);

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const openDetails = (id) => {
    navigate(`/admin/payments/${id}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Revenue</h1>
        <p className="text-sm text-gray-500">Monitor booking transactions and platform revenue.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Total Transactions" value={summary.totalTransactions ?? 0} />
        <Stat title="Successful Revenue" value={`₹${Number(summary.totalRevenue || summary.successfulRevenue || 0).toLocaleString("en-IN")}`} />
        <Stat title="Pending" value={summary.pendingTransactions ?? 0} />
        <Stat title="Refunded" value={`₹${Number(summary.refundedAmount || 0).toLocaleString("en-IN")}`} />
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setStatus(tab); setPage(1); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                status === tab ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={submitSearch} className="mt-4 flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment ID, booking ID, receipt..."
            className="min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2"
          />
          <button className="rounded-lg bg-black px-5 py-2 text-white">Search</button>
        </form>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">No transactions found.</div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} onView={openDetails} />
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button>
        <span className="py-2 text-sm text-gray-500">Page {page}</span>
        <button disabled={payments.length < 10} onClick={() => setPage(page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
