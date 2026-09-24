import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminNotificationBell from "../components/admin/AdminNotificationBell";

const items = [
  ["Dashboard", "/admin/dashboard"],
  ["Students", "/admin/students"],
  ["Hostels", "/admin/hostels"],
  ["Rooms", "/admin/rooms"],
  ["Bookings", "/admin/bookings"],
  ["Payments", "/admin/payments"],
  ["Complaints", "/admin/complaints"],
  ["Reviews", "/admin/reviews"],
  ["Notifications", "/admin/notifications"],
  ["System Settings", "/admin/settings"],
  ["Admin Profile", "/admin/profile"],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* Mobile Header */}
      <header className="flex items-center justify-between bg-slate-900 p-4 text-white md:hidden">
        <span className="font-bold">StudNest Admin</span>

        <div className="flex items-center gap-2">
          <AdminNotificationBell />

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } bg-slate-900 text-white md:block md:min-h-screen md:w-64`}
      >
        <div className="flex items-center justify-between p-5">
          <div className="text-xl font-bold">
            StudNest Admin
          </div>

          <div className="hidden md:block">
            <AdminNotificationBell />
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {items.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          className="m-4 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold transition hover:bg-slate-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
