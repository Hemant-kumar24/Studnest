import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaGraduationCap,
  FaRupeeSign,
  FaCheckCircle,
  FaBed,
  FaCalendarCheck,
  FaChevronRight,
  FaUsers,
  FaShieldAlt,
  FaHome,
} from "react-icons/fa";

import { getHostelById } from "../../services/hostelService";
import { getHostelRooms } from "../../services/roomService";
import { getHostelReviews } from "../../services/reviewService";

import RoomCard from "../../components/hostel/RoomCard";
import ReviewSection from "../../components/hostel/ReviewSection";
import { getApiErrorMessage } from "../../utils/apiError";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1000x600?text=StudNest";

export default function HostelDetails() {
  const { id } = useParams();

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD HOSTEL DETAILS
  // ==========================================

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) {
        setError("Invalid hostel ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          hostelRes,
          roomRes,
          reviewRes,
        ] = await Promise.all([
          getHostelById(id),
          getHostelRooms(id),
          getHostelReviews(id),
        ]);

        // ======================================
        // HOSTEL RESPONSE
        // ======================================

        const hostelData =
          hostelRes.data?.data ||
          hostelRes.data?.hostel ||
          hostelRes.data ||
          null;

        // ======================================
        // ROOMS RESPONSE
        // ======================================

        const roomData =
          roomRes.data?.data ||
          roomRes.data?.rooms ||
          [];

        // ======================================
        // REVIEWS RESPONSE
        // ======================================

        const reviewData =
          reviewRes.data?.data ||
          reviewRes.data?.reviews ||
          [];

        setHostel(hostelData);

        setRooms(
          Array.isArray(roomData)
            ? roomData
            : []
        );

        setReviews(
          Array.isArray(reviewData)
            ? reviewData
            : []
        );
      } catch (err) {
        console.error(
          "Hostel details error:",
          err
        );

        setError(
          getApiErrorMessage(err)
        );
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-6 h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

            <div className="grid lg:grid-cols-2">

              <div className="h-72 bg-slate-200 dark:bg-slate-800 sm:h-96 lg:h-[500px]" />

              <div className="space-y-5 p-6 sm:p-8 lg:p-10">

                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />

                <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />

                <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />

                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />

                <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />

                <div className="h-14 w-44 rounded-xl bg-slate-200 dark:bg-slate-800" />

              </div>
            </div>
          </div>

          <div className="mt-8 h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <div className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />

            <div className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          </div>

        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">

        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl font-bold text-red-500 dark:bg-red-950/40 dark:text-red-400">
            !
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Unable to load hostel
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-400">
            {error}
          </p>

          <Link
            to="/student/hostels"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <FaArrowLeft className="text-xs" />
            Back to Hostels
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!hostel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <FaHome />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Hostel not found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The hostel you're looking for doesn't exist or is unavailable.
          </p>

          <Link
            to="/student/hostels"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FaArrowLeft className="text-xs" />
            Browse Hostels
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================
  // HOSTEL DATA
  // ==========================================

  const image =
    typeof hostel?.images?.[0] === "string"
      ? hostel.images[0]
      : hostel?.images?.[0]?.url ||
        hostel?.image ||
        FALLBACK_IMAGE;

  const rating = Number(
    hostel?.rating || 0
  );

  const rent = Number(
    hostel?.monthlyRent || 0
  );

  const deposit = Number(
    hostel?.securityDeposit || 0
  );

  const availableRooms = Number(
    hostel?.availableRooms || 0
  );

  const genderPreference =
    hostel?.genderPreference || "Any";

  const propertyType =
    hostel?.propertyType ||
    "Accommodation";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 pb-36 dark:bg-slate-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ======================================
            BACK
        ====================================== */}

        <Link
          to="/student/hostels"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <FaArrowLeft className="text-xs" />
          Back to hostels
        </Link>

        {/* ======================================
            HERO
        ====================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="grid lg:grid-cols-2">

            {/* IMAGE */}

            <div className="relative h-72 overflow-hidden sm:h-96 lg:h-[520px]">

              <img
                src={image}
                alt={
                  hostel.propertyTitle ||
                  "Hostel"
                }
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    FALLBACK_IMAGE;
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* PROPERTY TYPE */}

              <div className="absolute left-5 top-5">

                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-800 shadow-lg backdrop-blur">

                  <FaHome className="text-indigo-500" />

                  {propertyType}

                </span>

              </div>

              {/* VERIFIED */}

              {hostel?.isVerified && (
                <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg">

                  <FaShieldAlt />

                  Verified

                </div>
              )}

              {/* IMAGE BOTTOM */}

              <div className="absolute bottom-5 left-5 right-5">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-slate-800 shadow-md">

                    <FaStar className="text-yellow-400" />

                    {rating > 0
                      ? rating.toFixed(1)
                      : "New"}

                  </span>

                  <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">

                    {hostel?.reviewCount ||
                      0}{" "}
                    reviews

                  </span>

                </div>

              </div>

            </div>

            {/* INFORMATION */}

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">

              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                StudNest Accommodation
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {hostel.propertyTitle}
              </h1>

              {/* LOCATION */}

              <div className="mt-5 flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <FaMapMarkerAlt />
                </div>

                <div>

                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {hostel.city ||
                      "Location unavailable"}
                  </p>

                  {hostel.address && (
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {hostel.address}
                    </p>
                  )}

                </div>

              </div>

              {/* COLLEGE */}

              {hostel.nearbyCollege && (
                <div className="mt-4 flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <FaGraduationCap />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Nearby College
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {hostel.nearbyCollege}
                    </p>

                  </div>

                </div>
              )}

              {/* QUICK INFO */}

              <div className="mt-6 grid grid-cols-2 gap-3">

                <InfoBox
                  icon={<FaUsers />}
                  label="Gender"
                  value={genderPreference}
                />

                <InfoBox
                  icon={<FaBed />}
                  label="Available"
                  value={`${availableRooms} rooms`}
                />

              </div>

              {/* PRICE */}

              <div className="mt-7 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Monthly Rent
                </p>

                <div className="mt-1 flex items-baseline gap-1">

                  <FaRupeeSign className="text-lg text-indigo-600 dark:text-indigo-400" />

                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {rent.toLocaleString()}
                  </span>

                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    /month
                  </span>

                </div>

                {deposit > 0 && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Security deposit: ₹
                    {deposit.toLocaleString()}
                  </p>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ======================================
            ABOUT
        ====================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

          <div className="mb-4">

            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              About the property
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              About this hostel
            </h2>

          </div>

          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {hostel.description ||
              "No description available for this property."}
          </p>

        </section>

        {/* ======================================
            AMENITIES
        ====================================== */}

        {hostel.amenities?.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

            <div className="mb-5">

              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Property facilities
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Amenities
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

              {hostel.amenities.map(
                (amenity, index) => (
                  <div
                    key={`${amenity}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50"
                  >

                    <FaCheckCircle className="shrink-0 text-emerald-500" />

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {amenity}
                    </span>

                  </div>
                )
              )}

            </div>

          </section>
        )}

        {/* ======================================
            ROOMS
        ====================================== */}

        <section className="mt-10">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Choose your room
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                Available Rooms
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select a room to continue with your booking.
              </p>

            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">

              <FaBed />

              {rooms.length} room
              {rooms.length !== 1
                ? "s"
                : ""}

            </div>

          </div>

          {rooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <FaBed className="text-xl" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                No rooms currently available
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Please check again later.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  selected={
                    selectedRoom?._id ===
                    room._id
                  }
                  onSelect={
                    setSelectedRoom
                  }
                />
              ))}

            </div>
          )}

        </section>

        {/* ======================================
            REVIEWS
        ====================================== */}

        <section className="mt-10">

          <ReviewSection
            hostelId={hostel._id}
            reviews={reviews}
            canReview={false}
            currentUserId={null}
            onReviewsChange={(
              updatedReviews
            ) => {
              setReviews(
                updatedReviews
              );
            }}
          />

        </section>

      </div>

      {/* ======================================
          STICKY BOOKING BAR
      ====================================== */}

      {selectedRoom && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">

          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <FaBed />
              </div>

              <div>

                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Room{" "}
                  {selectedRoom.roomNumber}{" "}
                  selected
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

                  <span>
                    {selectedRoom.roomType}
                  </span>

                  <span>•</span>

                  <span>
                    {
                      selectedRoom.availableBeds
                    }{" "}
                    bed
                    {selectedRoom.availableBeds !==
                    1
                      ? "s"
                      : ""}{" "}
                    available
                  </span>

                  <span>•</span>

                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    ₹
                    {Number(
                      selectedRoom.price ||
                        0
                    ).toLocaleString()}
                    /month
                  </span>

                </div>

              </div>

            </div>

            <Link
              to={`/student/bookings/create?hostelId=${hostel._id}&roomId=${selectedRoom._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl"
            >

              <FaCalendarCheck />

              Continue to Booking

              <FaChevronRight className="text-xs" />

            </Link>

          </div>

        </div>
      )}

    </main>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">

      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

        <span className="text-indigo-500">
          {icon}
        </span>

        {label}

      </div>

      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
        {value}
      </p>

    </div>
  );
}