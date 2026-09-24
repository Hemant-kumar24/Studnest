import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  BedDouble,
  IndianRupee,
  Users,
  Pencil,
  Wrench,
  CheckCircle,
  Trash2,
  Loader2,
  Inbox,
  Sparkles,
} from "lucide-react";

import {
  getHostelRooms,
  deleteRoom,
  updateRoomAvailability,
} from "../../services/adminRoomService";

import RoomStatusBadge from "../../components/admin/RoomStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminRooms() {
  const location = useLocation();

  // =========================================
  // GET HOSTEL ID FROM QUERY PARAM
  // URL:
  // /admin/rooms?hostelId=XXXXXXXX
  // =========================================

  const hostelId = new URLSearchParams(
    location.search
  ).get("hostelId");

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");

  // =========================================
  // LOAD ROOMS
  // =========================================

  const load = async () => {
    if (!hostelId) {
      setLoading(false);
      setError("Hostel ID is missing. Please select a hostel first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getHostelRooms(hostelId);

      const data = response.data?.data;

      if (Array.isArray(data)) {
        setRooms(data);
        setHostel(response.data?.hostel || null);
      } else {
        setRooms(
          response.data?.rooms ||
            data?.rooms ||
            []
        );

        setHostel(
          response.data?.hostel ||
            data?.hostel ||
            null
        );
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [hostelId]);

  // =========================================
  // DELETE ROOM
  // =========================================

  const remove = async (roomId) => {
    if (!window.confirm("Delete this room permanently?")) {
      return;
    }

    try {
      setWorkingId(roomId);
      setError("");

      await deleteRoom(roomId);

      setRooms((items) =>
        items.filter(
          (room) => room._id !== roomId
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  // =========================================
  // TOGGLE MAINTENANCE
  // =========================================

  const toggleAvailability = async (room) => {
    try {
      setWorkingId(room._id);
      setError("");

      const status = String(
        room.status || ""
      ).toLowerCase();

      const nextStatus =
        status === "maintenance"
          ? "available"
          : "maintenance";

      await updateRoomAvailability(
        room._id,
        {
          status: nextStatus,
        }
      );

      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWorkingId("");
    }
  };

  // =========================================
  // MISSING HOSTEL ID
  // =========================================

  if (!hostelId) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          <Link
            to="/admin/hostels"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Link>

          <section className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <BedDouble className="h-7 w-7 text-red-500" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Hostel ID is missing
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please open room management from a specific hostel.
            </p>

            <Link
              to="/admin/hostels"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Hostels
            </Link>

          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================================
            HEADER
        ========================================== */}

        <section className="mb-6">

          <Link
            to="/admin/hostels"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Link>

          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <BedDouble className="h-6 w-6 text-indigo-600" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Admin Panel
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {hostel?.propertyTitle ||
                    "Room Management"}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage rooms, beds, pricing and availability.
                </p>

              </div>

            </div>

            <Link
              to={`/admin/rooms/create?hostelId=${hostelId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </Link>

          </div>
        </section>

        {/* =========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

            <span>{error}</span>

          </div>
        )}

        {/* =========================================
            LOADING
        ========================================== */}

        {loading && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              )
            )}

          </section>
        )}

        {/* =========================================
            EMPTY STATE
        ========================================== */}

        {!loading &&
          !error &&
          rooms.length === 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Inbox className="h-7 w-7 text-slate-400" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No rooms found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add the first room for this hostel.
              </p>

              <Link
                to={`/admin/rooms/create?hostelId=${hostelId}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add First Room
              </Link>

            </section>
          )}

        {/* =========================================
            ROOM GRID
        ========================================== */}

        {!loading &&
          !error &&
          rooms.length > 0 && (
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {rooms.map((room) => {

                const isWorking =
                  workingId === room._id;

                const amenities =
                  Array.isArray(room.amenities)
                    ? room.amenities
                    : room.amenities
                    ? [room.amenities]
                    : [];

                const status =
                  String(
                    room.status || ""
                  ).toLowerCase();

                const isMaintenance =
                  status === "maintenance";

                return (
                  <article
                    key={room._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* Card Header */}

                    <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                            <BedDouble className="h-5 w-5 text-indigo-600" />
                          </div>

                          <div>

                            <h2 className="text-lg font-bold text-slate-900">
                              Room{" "}
                              {room.roomNumber}
                            </h2>

                            <p className="text-sm text-slate-500">
                              {room.roomType ||
                                "Room"}
                            </p>

                          </div>

                        </div>

                        <RoomStatusBadge
                          status={room.status}
                          availableBeds={
                            room.availableBeds
                          }
                          capacity={
                            room.capacity
                          }
                        />

                      </div>

                    </div>

                    {/* Room Details */}

                    <div className="p-5">

                      {/* Price */}

                      <div className="mb-5 rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Monthly Rent
                        </p>

                        <div className="mt-1 flex items-center gap-1">

                          <IndianRupee className="h-5 w-5 text-slate-700" />

                          <span className="text-xl font-bold text-slate-900">
                            {Number(
                              room.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          <span className="text-sm text-slate-400">
                            / month
                          </span>

                        </div>

                      </div>

                      {/* Beds */}

                      <div className="grid grid-cols-2 gap-3">

                        <DetailBox
                          icon={
                            <Users className="h-4 w-4" />
                          }
                          label="Capacity"
                          value={`${room.capacity || 0} beds`}
                        />

                        <DetailBox
                          icon={
                            <BedDouble className="h-4 w-4" />
                          }
                          label="Available"
                          value={`${room.availableBeds || 0} beds`}
                        />

                      </div>

                      {/* Amenities */}

                      <div className="mt-5">

                        <div className="mb-2 flex items-center gap-2">

                          <Sparkles className="h-4 w-4 text-purple-500" />

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Amenities
                          </p>

                        </div>

                        {amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-2">

                            {amenities.map(
                              (
                                amenity,
                                index
                              ) => (
                                <span
                                  key={`${amenity}-${index}`}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                >
                                  {amenity}
                                </span>
                              )
                            )}

                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">
                            No amenities listed
                          </p>
                        )}

                      </div>

                      {/* Actions */}

                      <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">

                        {/* Edit */}

                        <Link
                          to={`/admin/rooms/${room._id}/edit?hostelId=${hostelId}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Room
                        </Link>

                        {/* Maintenance / Available */}

                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() =>
                            toggleAvailability(
                              room
                            )
                          }
                          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            isMaintenance
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-amber-500 text-white hover:bg-amber-600"
                          }`}
                        >

                          {isWorking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isMaintenance ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Wrench className="h-4 w-4" />
                          )}

                          {isMaintenance
                            ? "Make Available"
                            : "Mark Maintenance"}

                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() =>
                            remove(room._id)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isWorking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}

                          Delete Room

                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </section>
          )}

      </div>
    </main>
  );
}


// ==========================================
// DETAIL BOX
// ==========================================

function DetailBox({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex items-center gap-1.5 text-indigo-600">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}