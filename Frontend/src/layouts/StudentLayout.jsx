import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/notifications/NotificationBell";

const items = [
  ["Dashboard", "/student/dashboard"],
  ["Find Hostels", "/student/hostels"],
  ["Nearby Hostels", "/student/nearby"],
  ["My Bookings", "/student/bookings"],
  ["Favorites", "/student/favorites"],
  ["Notifications", "/student/notifications"],
  ["Profile", "/student/profile"],
];

export default function StudentLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-indigo-900 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink
            to="/student/dashboard"
            className="text-xl font-bold"
          >
            StudNest
          </NavLink>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />

            <NavLink
              to="/student/profile"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10 sm:block"
            >
              Profile
            </NavLink>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <nav className="flex gap-2 overflow-x-auto bg-white p-3 md:min-h-screen md:w-56 md:flex-col">
          {items.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
