import { useEffect, useState } from "react";
import {
  BedDouble,
  Users,
  IndianRupee,
  Sparkles,
  Save,
  Loader2,
  Hash,
} from "lucide-react";

const emptyForm = {
  roomNumber: "",
  roomType: "",
  capacity: 1,
  availableBeds: 1,
  price: "",
  amenities: "",
};

export default function RoomForm({ room, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!room) {
      setForm(emptyForm);
      return;
    }

    setForm({
      roomNumber: room.roomNumber || "",
      roomType: room.roomType || "",
      capacity: room.capacity ?? 1,
      availableBeds: room.availableBeds ?? 1,
      price: room.price ?? "",
      amenities: Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : room.amenities || "",
    });
  }, [room]);

  const change = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    const capacity = Number(form.capacity);
    const availableBeds = Number(form.availableBeds);
    const price = Number(form.price);

    if (availableBeds > capacity) {
      alert("Available beds cannot exceed room capacity.");
      return;
    }

    if (capacity < 1) {
      alert("Room capacity must be at least 1.");
      return;
    }

    if (availableBeds < 0) {
      alert("Available beds cannot be negative.");
      return;
    }

    if (price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    onSubmit({
      roomNumber: form.roomNumber.trim(),
      roomType: form.roomType,
      capacity,
      availableBeds,
      price,
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-8">

      {/* =========================================
          ROOM INFORMATION
      ========================================== */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <BedDouble className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Room Information
            </h3>

            <p className="text-xs text-slate-500">
              Enter the basic details of this room.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Room Number */}

          <FormField
            label="Room Number"
            required
            icon={<Hash className="h-4 w-4" />}
          >
            <input
              type="text"
              value={form.roomNumber}
              onChange={change("roomNumber")}
              placeholder="e.g. 101"
              required
              className={inputClass}
            />
          </FormField>

          {/* Room Type */}

          <FormField
            label="Room Type"
            required
            icon={<BedDouble className="h-4 w-4" />}
          >
            <select
              value={form.roomType}
              onChange={change("roomType")}
              required
              className={inputClass}
            >
              <option value="">
                Select room type
              </option>

              <option value="Single">
                Single
              </option>

              <option value="Double">
                Double
              </option>

              <option value="Triple">
                Triple
              </option>

              <option value="Four Sharing">
                Four Sharing
              </option>

              <option value="Dormitory">
                Dormitory
              </option>
            </select>
          </FormField>

        </div>
      </section>

      {/* =========================================
          CAPACITY & AVAILABILITY
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <Users className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Capacity & Availability
            </h3>

            <p className="text-xs text-slate-500">
              Configure the number of beds in this room.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Capacity */}

          <FormField
            label="Room Capacity"
            required
            icon={<Users className="h-4 w-4" />}
            hint="Maximum number of students this room can accommodate."
          >
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={change("capacity")}
              required
              className={inputClass}
            />
          </FormField>

          {/* Available Beds */}

          <FormField
            label="Available Beds"
            required
            icon={<BedDouble className="h-4 w-4" />}
            hint="Number of beds currently available for booking."
          >
            <input
              type="number"
              min="0"
              max={form.capacity}
              value={form.availableBeds}
              onChange={change("availableBeds")}
              required
              className={inputClass}
            />
          </FormField>

        </div>

        {/* Availability Preview */}

        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Current Availability
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {form.availableBeds || 0} of{" "}
                {form.capacity || 0} beds available
              </p>
            </div>

            <div className="h-2 w-32 overflow-hidden rounded-full bg-white sm:w-48">

              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{
                  width: `${
                    Number(form.capacity) > 0
                      ? Math.min(
                          100,
                          (Number(form.availableBeds) /
                            Number(form.capacity)) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          PRICING
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <IndianRupee className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pricing
            </h3>

            <p className="text-xs text-slate-500">
              Set the monthly price for this room.
            </p>
          </div>

        </div>

        <FormField
          label="Monthly Price"
          required
          icon={<IndianRupee className="h-4 w-4" />}
        >
          <div className="relative">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
              ₹
            </span>

            <input
              type="number"
              min="0"
              value={form.price}
              onChange={change("price")}
              placeholder="5000"
              required
              className={`${inputClass} pl-8`}
            />

          </div>
        </FormField>

      </section>

      {/* =========================================
          AMENITIES
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Amenities
            </h3>

            <p className="text-xs text-slate-500">
              Add facilities available inside the room.
            </p>
          </div>

        </div>

        <FormField
          label="Room Amenities"
          icon={<Sparkles className="h-4 w-4" />}
          hint="Separate multiple amenities with commas."
        >
          <input
            type="text"
            value={form.amenities}
            onChange={change("amenities")}
            placeholder="WiFi, AC, Study Table, Attached Bathroom"
            className={inputClass}
          />
        </FormField>

        {/* Amenities Preview */}

        {form.amenities && (
          <div className="mt-4 flex flex-wrap gap-2">

            {form.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700"
                >
                  {item}
                </span>
              ))}

          </div>
        )}

      </section>

      {/* =========================================
          ACTIONS
      ========================================== */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

        <button
          type="button"
          disabled={saving}
          onClick={() => window.history.back()}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {room ? "Update Room" : "Add Room"}
            </>
          )}
        </button>

      </div>

    </form>
  );
}


// ==========================================
// FORM FIELD
// ==========================================

function FormField({
  label,
  required = false,
  icon,
  hint,
  children,
}) {
  return (
    <div className="space-y-2">

      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">

        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}

      </label>

      {children}

      {hint && (
        <p className="text-xs leading-5 text-slate-400">
          {hint}
        </p>
      )}

    </div>
  );
}


// ==========================================
// INPUT CLASS
// ==========================================

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";