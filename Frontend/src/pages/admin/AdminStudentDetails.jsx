import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaCommentAlt,
  FaEnvelope,
  FaExclamationTriangle,
  FaHome,
  FaPhone,
  FaStar,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";

import adminStudentService from "../../services/adminStudentService";
import StudentStatusBadge from "../../components/admin/StudentStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminStudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await adminStudentService.getStudentById(id);

        /*
          Backend response:

          {
            success: true,
            student: {
              ...,
              bookings: [],
              complaints: [],
              reviews: []
            }
          }
        */

        const studentData =
          response?.student ||
          response?.data ||
          response;

        setStudent(studentData || null);
      } catch (err) {
        console.error(
          "Load student details error:",
          err
        );

        setError(
          getApiErrorMessage(err) ||
            "Unable to load student."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStudent();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">

          <div className="h-6 w-32 rounded bg-slate-200" />

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex gap-5">
              <div className="h-20 w-20 rounded-2xl bg-slate-200" />

              <div className="flex-1 space-y-3">
                <div className="h-7 w-56 rounded bg-slate-200" />
                <div className="h-4 w-72 rounded bg-slate-200" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>

          <div className="h-64 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">

          <Link
            to="/admin/students"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <FaArrowLeft />
            Back to Students
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="font-semibold">
              Unable to load student
            </h2>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================
  if (!student) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">

          <Link
            to="/admin/students"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <FaArrowLeft />
            Back to Students
          </Link>

          <div className="mt-6 rounded-2xl border bg-white p-12 text-center">
            <FaUser className="mx-auto text-3xl text-slate-300" />

            <h2 className="mt-4 font-semibold text-slate-900">
              Student not found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The requested student does not exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const bookings = Array.isArray(student.bookings)
    ? student.bookings
    : [];

  const complaints = Array.isArray(
    student.complaints
  )
    ? student.complaints
    : [];

  const reviews = Array.isArray(student.reviews)
    ? student.reviews
    : [];

  const isActive =
    student.isActive !== false;

  const location =
    student.location || {};

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ======================================
            BACK
        ====================================== */}
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <FaArrowLeft />
          Back to Students
        </Link>

        {/* ======================================
            STUDENT HEADER
        ====================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-8 text-white md:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 text-3xl font-bold">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={student.name || "Student"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (student.name || "S")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold md:text-3xl">
                    {student.name || "Student"}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isActive
                        ? "bg-emerald-400/20 text-emerald-100"
                        : "bg-red-400/20 text-red-100"
                    }`}
                  >
                    {isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-indigo-100">
                  <FaEnvelope />
                  {student.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 divide-x border-t sm:grid-cols-4">

            <Stat
              label="Bookings"
              value={bookings.length}
              icon={<FaCalendarAlt />}
            />

            <Stat
              label="Complaints"
              value={complaints.length}
              icon={<FaExclamationTriangle />}
            />

            <Stat
              label="Reviews"
              value={reviews.length}
              icon={<FaStar />}
            />

            <Stat
              label="Status"
              value={
                isActive
                  ? "Active"
                  : "Inactive"
              }
              icon={<FaCheckCircle />}
            />
          </div>
        </section>

        {/* ======================================
            PROFILE + ACCOUNT
        ====================================== */}
        <section className="grid gap-6 lg:grid-cols-2">

          {/* Profile */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <FaUser />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Profile Information
                </h2>

                <p className="text-xs text-slate-500">
                  Student contact and location details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <InfoItem
                icon={<FaUser />}
                label="Full Name"
                value={student.name}
              />

              <InfoItem
                icon={<FaEnvelope />}
                label="Email"
                value={student.email}
              />

              <InfoItem
                icon={<FaPhone />}
                label="Phone"
                value={student.phone}
              />

              <InfoItem
                icon={<FaMapMarkerAlt />}
                label="City"
                value={
                  location.city ||
                  location.address
                }
              />

            </div>
          </div>

          {/* Account */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <FaCheckCircle />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Account Information
                </h2>

                <p className="text-xs text-slate-500">
                  Account status and registration details.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">

              <InfoItem
                label="Account Status"
                value={
                  isActive
                    ? "Active"
                    : "Inactive"
                }
              />

              <InfoItem
                label="Registered On"
                value={
                  student.createdAt
                    ? new Date(
                        student.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "—"
                }
              />

              <InfoItem
                label="User Role"
                value={
                  student.role || "student"
                }
              />
            </div>
          </div>
        </section>

        {/* ======================================
            BOOKINGS
        ====================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <SectionHeader
            icon={<FaHome />}
            title="Booking History"
            subtitle={`${bookings.length} booking${
              bookings.length !== 1
                ? "s"
                : ""
            }`}
          />

          <div className="p-5 md:p-6">

            {bookings.length === 0 ? (
              <EmptyState
                icon={<FaCalendarAlt />}
                title="No booking history"
                text="This student has not made any bookings yet."
              />
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <h3 className="font-semibold text-slate-900">
                          {booking.hostelId
                            ?.propertyTitle ||
                            "Hostel"}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                          <span className="inline-flex items-center gap-2">
                            <FaBed />
                            {booking.roomId
                              ?.roomNumber
                              ? `Room ${booking.roomId.roomNumber}`
                              : booking.roomType ||
                                "Room"}
                          </span>

                          <span>
                            {booking.duration
                              ? `${booking.duration} month${
                                  booking.duration !== 1
                                    ? "s"
                                    : ""
                                }`
                              : "—"}
                          </span>

                          <span>
                            {booking.startDate
                              ? new Date(
                                  booking.startDate
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">

                        <p className="font-bold text-slate-900">
                          ₹
                          {Number(
                            booking.amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <StatusPill
                          value={
                            booking.status ||
                            "Pending"
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            COMPLAINTS
        ====================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <SectionHeader
            icon={<FaExclamationTriangle />}
            title="Complaints"
            subtitle={`${complaints.length} complaint${
              complaints.length !== 1
                ? "s"
                : ""
            }`}
          />

          <div className="p-5 md:p-6">

            {complaints.length === 0 ? (
              <EmptyState
                icon={
                  <FaCheckCircle />
                }
                title="No complaints"
                text="This student has no complaint history."
              />
            ) : (
              <div className="space-y-3">
                {complaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <h3 className="font-semibold text-slate-900">
                          {complaint.subject ||
                            complaint.category ||
                            "Complaint"}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {complaint.category ||
                              "Other"}
                          </span>

                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {complaint.priority ||
                              "Medium"}
                          </span>

                          <StatusPill
                            value={
                              complaint.status ||
                              "Open"
                            }
                          />
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {complaint.description ||
                            "No description provided."}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-slate-400">
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            REVIEWS
        ====================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <SectionHeader
            icon={<FaCommentAlt />}
            title="Reviews"
            subtitle={`${reviews.length} review${
              reviews.length !== 1
                ? "s"
                : ""
            }`}
          />

          <div className="p-5 md:p-6">

            {reviews.length === 0 ? (
              <EmptyState
                icon={<FaStar />}
                title="No reviews"
                text="This student has not submitted any reviews."
              />
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <h3 className="font-semibold text-slate-900">
                          {review.hostelId
                            ?.propertyTitle ||
                            "Hostel"}
                        </h3>

                        <div className="mt-2 flex items-center gap-1">
                          {Array.from({
                            length: 5,
                          }).map((_, index) => (
                            <FaStar
                              key={index}
                              className={
                                index <
                                Number(
                                  review.rating || 0
                                )
                                  ? "text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}

                          <span className="ml-2 text-xs font-semibold text-slate-500">
                            {review.rating || 0}/5
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {review.comment ||
                            "No comment provided."}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-slate-400">
                        {review.createdAt
                          ? new Date(
                              review.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// ==========================================
// STAT
// ==========================================
function Stat({
  label,
  value,
  icon,
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 md:px-6">
      <div className="text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-lg font-bold text-slate-900">
          {value}
        </p>

        <p className="text-xs text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// INFO ITEM
// ==========================================
function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </p>

      <p className="mt-1 break-words font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

// ==========================================
// SECTION HEADER
// ==========================================
function SectionHeader({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 md:px-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div>
        <h2 className="font-semibold text-slate-900">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================
function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-3 font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}

// ==========================================
// STATUS PILL
// ==========================================
function StatusPill({
  value,
}) {
  const status = String(
    value || ""
  ).toLowerCase();

  let className =
    "bg-slate-100 text-slate-600";

  if (
    status.includes("confirm") ||
    status.includes("active") ||
    status.includes("complete") ||
    status.includes("resolve")
  ) {
    className =
      "bg-emerald-50 text-emerald-700";
  } else if (
    status.includes("pending") ||
    status.includes("progress") ||
    status.includes("approved")
  ) {
    className =
      "bg-amber-50 text-amber-700";
  } else if (
    status.includes("reject") ||
    status.includes("cancel")
  ) {
    className =
      "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`mt-2 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {value}
    </span>
  );
}