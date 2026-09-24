import { useEffect, useState } from "react";
import LocationButton from "./LocationButton";

export default function ProfileForm({ user, onSave, saving = false }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    college: "",
    gender: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phone: user.phone || "",
      college: user.college || "",
      gender: user.gender || "",
    });
  }, [user]);

  const update = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const cleanData = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      gender: form.gender,
    };

    if (cleanData.name.length < 2) {
      return;
    }

    await onSave(cleanData);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* Heading */}
      <div className="mb-2">
        <h2 className="text-lg font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Keep your profile information up to date.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className={labelClass}
        >
          Full Name
        </label>

        <input
          id="name"
          type="text"
          value={form.name}
          onChange={update("name")}
          required
          minLength={2}
          maxLength={100}
          placeholder="Enter your full name"
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className={labelClass}
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={update("phone")}
          inputMode="numeric"
          maxLength={15}
          placeholder="Enter your phone number"
          className={inputClass}
        />
      </div>

      {/* College */}
      <div>
        <label
          htmlFor="college"
          className={labelClass}
        >
          College
        </label>

        <input
          id="college"
          type="text"
          value={form.college}
          onChange={update("college")}
          maxLength={150}
          placeholder="Enter your college name"
          className={inputClass}
        />
      </div>

      {/* Gender */}
      <div>
        <label
          htmlFor="gender"
          className={labelClass}
        >
          Gender
        </label>

        <select
          id="gender"
          value={form.gender}
          onChange={update("gender")}
          className={inputClass}
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

        <LocationButton />
      </div>
    </form>
  );
}