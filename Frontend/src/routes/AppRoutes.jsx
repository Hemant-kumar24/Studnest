import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import Landing from "../pages/Landing";
import RoleSelection from "../pages/RoleSelection";
import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
import StudentDashboard from "../pages/student/StudentDashboard";
import HostelDiscovery from "../pages/student/HostelDiscovery";
import NearbyHostels from "../pages/student/NearbyHostels";
import StudentProfile from "../pages/student/StudentProfile"; import Complaints from "../pages/student/Complaints"; import ComplaintCreate from "../pages/student/ComplaintCreate"; import Reviews from "../pages/student/Reviews"; import ReviewCreate from "../pages/student/ReviewCreate";
import MyFavorites from "../pages/student/MyFavorites";
import Notifications from "../pages/student/Notifications";
import HostelDetails from "../pages/hostel/HostelDetails";
import BookingCreate from "../pages/booking/BookingCreate";
import BookingPayment from "../pages/booking/BookingPayment";
import MyBookings from "../pages/booking/MyBookings";
import BookingDetails from "../pages/booking/BookingDetails";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminStudents from "../pages/admin/AdminStudents"; import AdminStudentDetails from "../pages/admin/AdminStudentDetails";
import AdminHostels from "../pages/admin/AdminHostels"; import AdminHostelDetails from "../pages/admin/AdminHostelDetails"; import AdminHostelFormPage from "../pages/admin/AdminHostelFormPage";
import AdminRooms from "../pages/admin/AdminRooms"; import AdminRoomFormPage from "../pages/admin/AdminRoomFormPage";
import AdminBookings from "../pages/admin/AdminBookings"; import AdminBookingDetails from "../pages/admin/AdminBookingDetails";
import AdminComplaints from "../pages/admin/AdminComplaints"; import AdminComplaintDetails from "../pages/admin/AdminComplaintDetails";
import AdminReviews from "../pages/admin/AdminReviews"; import AdminReviewDetails from "../pages/admin/AdminReviewDetails";
import AdminPayments from "../pages/admin/AdminPayments"; import AdminPaymentDetails from "../pages/admin/AdminPaymentDetails";
import AdminNotifications from "../pages/admin/AdminNotifications"; import AdminSystemSettings from "../pages/admin/AdminSystemSettings"; import AdminProfileSettings from "../pages/admin/AdminProfileSettings";

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Landing />} /><Route path="/choose-role/login" element={<RoleSelection redirectTo="login" />} /><Route path="/choose-role/register" element={<RoleSelection redirectTo="register" />} />
    <Route element={<PublicRoute />}><Route path="/login" element={<UserLogin />} /><Route path="/register" element={<UserRegister />} /><Route path="/user/login" element={<UserLogin />} /><Route path="/user/register" element={<UserRegister />} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin/register" element={<AdminRegister />} /></Route>
    <Route element={<ProtectedRoute allowedRoles={["student"]} />}><Route element={<StudentLayout />}><Route path="/student/dashboard" element={<StudentDashboard />} /><Route path="/student/hostels" element={<HostelDiscovery />} /><Route path="/student/hostels/:id" element={<HostelDetails />} /><Route path="/student/nearby" element={<NearbyHostels />} /><Route path="/student/profile" element={<StudentProfile />} /><Route path="/student/favorites" element={<MyFavorites />} /><Route path="/student/notifications" element={<Notifications />} /><Route path="/student/complaints" element={<Complaints />} /><Route path="/student/complaints/create" element={<ComplaintCreate />} /><Route path="/student/reviews" element={<Reviews />} /><Route path="/student/reviews/create" element={<ReviewCreate />} /><Route path="/student/bookings" element={<MyBookings />} /><Route path="/student/bookings/create" element={<BookingCreate />} /><Route path="/student/bookings/payment" element={<BookingPayment />} /><Route path="/student/bookings/:id/pay" element={<BookingPayment />} /><Route path="/student/bookings/:id" element={<BookingDetails />} /></Route></Route>
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}><Route element={<AdminLayout />}><Route path="/admin/dashboard" element={<AdminDashboard />} /><Route path="/admin/students" element={<AdminStudents />} /><Route path="/admin/students/:id" element={<AdminStudentDetails />} /><Route path="/admin/hostels" element={<AdminHostels />} /><Route path="/admin/hostels/create" element={<AdminHostelFormPage />} /><Route path="/admin/hostels/:id/edit" element={<AdminHostelFormPage />} /><Route path="/admin/hostels/:id" element={<AdminHostelDetails />} /><Route path="/admin/rooms" element={<AdminRooms />} /><Route path="/admin/rooms/create" element={<AdminRoomFormPage />} /><Route path="/admin/rooms/:id/edit" element={<AdminRoomFormPage />} /><Route path="/admin/bookings" element={<AdminBookings />} /><Route path="/admin/bookings/:id" element={<AdminBookingDetails />} /><Route path="/admin/complaints" element={<AdminComplaints />} /><Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} /><Route path="/admin/reviews" element={<AdminReviews />} /><Route path="/admin/reviews/:id" element={<AdminReviewDetails />} /><Route path="/admin/payments" element={<AdminPayments />} /><Route path="/admin/payments/:id" element={<AdminPaymentDetails />} /><Route path="/admin/notifications" element={<AdminNotifications />} /><Route path="/admin/settings" element={<AdminSystemSettings />} /><Route path="/admin/profile" element={<AdminProfileSettings />} /></Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
