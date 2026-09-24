import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  Save,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";

import RoomForm from "../../components/admin/RoomForm";
import {
  createRoom,
  getRoom,
  updateRoom,
} from "../../services/adminRoomService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminRoomFormPage() {
  const { roomId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const queryHostelId = new URLSearchParams(location.search).get("hostelId");

  const currentHostelId = queryHostelId;

  const editing = Boolean(roomId);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD ROOM FOR EDIT
  // =========================================

  useEffect(() => {
    if (!editing || !roomId) return;

    const loadRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRoom(roomId);

        const roomData =
          response.data?.data ||
          response.data?.room ||
          response.data ||
          null;

        setRoom(roomData);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId, editing]);

  // =========================================
  // SUBMIT
  // =========================================

  const submit = async (data) => {
    try {
      setSaving(true);
      setError("");

      if (editing) {
        await updateRoom(roomId, data);
      } else {
        if (!currentHostelId) {
          throw new Error("Hostel ID is required to create a room.");
        }

        await createRoom(currentHostelId, data);
      }

      // Go back to hostel-specific rooms page
      if (currentHostelId) {
        navigate(`/admin/rooms?hostelId=${currentHostelId}`);
      } else {
        navigate("/admin/rooms");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // BACK URL
  // =========================================

  const backUrl = currentHostelId
    ? `/admin/rooms?hostelId=${currentHostelId}`
    : "/admin/hostels";

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mb-6 h-28 animate-pulse rounded-2xl bg-slate-200" />

          <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* =========================================
            BACK
        ========================================== */}

        <Link
          to={backUrl}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Link>

        {/* =========================================
            HEADER
        ========================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <BedDouble className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Admin Panel
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {editing ? "Edit Room" : "Add Room"}
                  </h1>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {editing
                      ? "Update room details, pricing, capacity and availability."
                      : "Add a new room and configure its capacity, pricing and amenities."}
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 sm:flex">
                <Save className="h-4 w-4 text-indigo-600" />

                {editing ? "Update Room" : "Create Room"}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            HOSTEL INFO
        ========================================== */}

        {currentHostelId && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Building2 className="h-4 w-4 text-indigo-600" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Hostel
              </p>

              <p className="mt-0.5 text-sm font-medium text-slate-700">
                Room belongs to the selected hostel
              </p>
            </div>
          </div>
        )}

        {/* =========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to save room
              </p>

              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* =========================================
            FORM
        ========================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <BedDouble className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Room Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Enter accurate information about this room.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <RoomForm
              room={room}
              onSubmit={submit}
              saving={saving}
            />
          </div>
        </section>

        {/* =========================================
            INFO
        ========================================== */}

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
            <BedDouble className="h-4 w-4 text-indigo-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Review room information before saving
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Make sure room number, type, capacity, pricing, amenities and
              availability are correct.
            </p>
          </div>
        </div>

        {/* =========================================
            SAVING OVERLAY
        ========================================== */}

        {saving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]">
            <div className="flex min-w-[270px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-2xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {editing ? "Updating room..." : "Creating room..."}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Please wait while we save your changes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}