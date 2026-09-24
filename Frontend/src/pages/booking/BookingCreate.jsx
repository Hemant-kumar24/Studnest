import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaLock,
  FaCreditCard,
  FaBed,
  FaMapMarkerAlt,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";

import { getHostelById } from "../../services/hostelService";
import { getRoomById } from "../../services/roomService";
import { createBooking } from "../../services/bookingService";
import BookingSummary from "../../components/booking/BookingSummary";
import { getApiErrorMessage } from "../../utils/apiError";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=StudNest";

export default function BookingCreate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hostelId = searchParams.get("hostelId");
  const roomId = searchParams.get("roomId");

  const [hostel, setHostel] = useState(null);
  const [room, setRoom] = useState(null);

  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* =========================
     Load Hostel + Room
  ========================= */

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!hostelId || !roomId) {
          throw new Error(
            "Hostel and room information is missing."
          );
        }

        const [hostelRes, roomRes] =
          await Promise.all([
            getHostelById(hostelId),
            getRoomById(roomId),
          ]);

        /*
          Hostel backend returns hostel directly:
          res.json(hostel)

          But these fallbacks also support:
          { data: hostel }
          { hostel: hostel }
        */
        const hostelData =
          hostelRes.data?.data ||
          hostelRes.data?.hostel ||
          hostelRes.data ||
          null;

        /*
          Room endpoint may return:
          { data: room }
          { room: room }
          or direct room object
        */
        const roomData =
          roomRes.data?.data ||
          roomRes.data?.room ||
          roomRes.data ||
          null;

        if (!hostelData?._id) {
          throw new Error(
            "Hostel information could not be found."
          );
        }

        if (!roomData?._id) {
          throw new Error(
            "Room information could not be found."
          );
        }

        /*
          Extra safety:
          Make sure selected room actually belongs
          to selected hostel.
        */
        const selectedRoomHostelId =
          roomData?.hostelId?._id ||
          roomData?.hostelId;

        if (
          selectedRoomHostelId &&
          String(selectedRoomHostelId) !==
            String(hostelId)
        ) {
          throw new Error(
            "This room does not belong to the selected hostel."
          );
        }

        if (
          String(roomData._id) !==
          String(roomId)
        ) {
          throw new Error(
            "Invalid room information."
          );
        }

        setHostel(hostelData);
        setRoom(roomData);
      } catch (err) {
        console.error(
          "Booking data error:",
          err
        );

        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [hostelId, roomId]);

  /* =========================
     Price
  ========================= */

  const monthlyPrice = Number(
    room?.price ||
      hostel?.monthlyRent ||
      0
  );

  const totalAmount = useMemo(() => {
    return (
      monthlyPrice *
      Number(duration || 1)
    );
  }, [monthlyPrice, duration]);

  /* =========================
     Submit Booking
  ========================= */

  const submitBooking = async (event) => {
    event.preventDefault();

    setError("");

    if (!hostelId || !roomId) {
      setError(
        "Invalid hostel or room information."
      );
      return;
    }

    if (!hostel?._id || !room?._id) {
      setError(
        "Hostel or room information is unavailable."
      );
      return;
    }

    if (!startDate) {
      setError(
        "Please select a start date."
      );
      return;
    }

    if (startDate < today) {
      setError(
        "Start date cannot be in the past."
      );
      return;
    }

    const selectedDuration =
      Number(duration);

    if (
      !selectedDuration ||
      selectedDuration < 1
    ) {
      setError(
        "Please select a valid duration."
      );
      return;
    }

    if (monthlyPrice <= 0) {
      setError(
        "Invalid room price."
      );
      return;
    }

    /*
      Extra client-side availability check.
      Backend will perform the final check.
    */
    if (
      room.status &&
      String(room.status).toLowerCase() !==
        "available"
    ) {
      setError(
        "This room is currently unavailable."
      );
      return;
    }

    if (
      Number(room.availableBeds || 0) <= 0
    ) {
      setError(
        "No beds are currently available in this room."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await createBooking({
          hostelId,
          roomId,
          duration: selectedDuration,
          startDate,
          /*
            Backend calculates the trusted amount
            from room.price.
            This value is only sent for compatibility.
          */
          amount: totalAmount,
          note: note.trim(),
        });

      const booking =
        response.data?.data ||
        response.data?.booking ||
        response.data;

      if (!booking?._id) {
        throw new Error(
          "Booking was created but no booking ID was returned."
        );
      }

      /*
        Booking created successfully.
        Move to payment page.
      */
      navigate(
        `/student/bookings/${booking._id}/pay`
      );
    } catch (err) {
      console.error(
        "Create booking error:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">

          <div className="mb-6 h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="h-10 w-72 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="h-[650px] rounded-2xl bg-white dark:bg-slate-900 lg:col-span-2" />

            <div className="h-[450px] rounded-2xl bg-white dark:bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error && (!hostel || !room)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl font-bold text-red-500 dark:bg-red-950/30 dark:text-red-400">
            !
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Unable to load booking
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <FaArrowLeft className="text-xs" />
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const hostelImage =
    typeof hostel?.images?.[0] ===
    "string"
      ? hostel.images[0]
      : hostel?.images?.[0]?.url ||
        hostel?.image ||
        FALLBACK_IMAGE;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 pb-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </button>

        {/* Header */}
        <section className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            <FaCalendarAlt className="text-xs" />
            Reserve your room
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Complete your booking
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Choose your move-in date and stay duration,
            then review your booking before continuing
            to secure payment.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Booking couldn't be completed
              </p>

              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-3">

          {/* =========================
              Booking Form
          ========================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">

            {/* Selected Hostel */}
            <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex gap-4">

                <img
                  src={hostelImage}
                  alt={
                    hostel.propertyTitle ||
                    "Hostel"
                  }
                  className="h-20 w-24 shrink-0 rounded-xl object-cover sm:h-24 sm:w-32"
                  onError={(e) => {
                    e.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Selected property
                  </p>

                  <h2 className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white">
                    {hostel.propertyTitle ||
                      "Hostel"}
                  </h2>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <FaMapMarkerAlt className="text-indigo-500" />
                    <span className="truncate">
                      {hostel.city ||
                        "Location unavailable"}
                    </span>
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {room.roomType}
                    </span>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Room {room.roomNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <FaCalendarAlt />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Booking details
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tell us when you want to move in
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={submitBooking}
              className="space-y-6 p-6"
            >

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Start date
                </label>

                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) =>
                      setStartDate(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <FaLock />
                  Move-in date must be today or later.
                </p>
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Stay duration
                </label>

                <div className="relative">
                  <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) =>
                      setDuration(
                        e.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="1">
                      1 month
                    </option>

                    <option value="2">
                      2 months
                    </option>

                    <option value="3">
                      3 months
                    </option>

                    <option value="6">
                      6 months
                    </option>

                    <option value="12">
                      12 months
                    </option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="note"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Note
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <FaFileAlt className="absolute left-4 top-4 text-slate-400" />

                  <textarea
                    id="note"
                    value={note}
                    maxLength={1000}
                    rows={5}
                    onChange={(e) =>
                      setNote(
                        e.target.value
                      )
                    }
                    placeholder="Any information for the hostel admin..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="mt-2 flex justify-end text-xs text-slate-400">
                  {note.length}/1000
                </div>
              </div>

              {/* Total */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900/30 dark:bg-indigo-900/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
                      Estimated total
                    </p>

                    <div className="mt-1 flex items-center gap-1">
                      <FaRupeeSign className="text-lg text-indigo-600 dark:text-indigo-400" />

                      <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">
                        {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ₹
                      {monthlyPrice.toLocaleString()}
                      {" × "}
                      {duration} month
                      {Number(duration) > 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating booking...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Continue to Payment
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <FaLock />
                Secure booking and payment process.
              </p>
            </form>
          </section>

          {/* =========================
              Booking Summary
          ========================= */}

          <aside className="lg:sticky lg:top-6">
            <BookingSummary
              hostel={hostel}
              room={room}
              duration={duration}
              startDate={startDate}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}