import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";

import HostelForm from "../../components/admin/HostelForm";
import {
  createHostel,
  getAdminHostel,
  updateHostel,
} from "../../services/adminHostelService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminHostelFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;

    const loadHostel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminHostel(id);

        setHostel(
          response.data?.data ||
          response.data?.hostel ||
          response.data ||
          null
        );
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadHostel();
  }, [id, editing]);

  const submit = async (data) => {
    try {
      setSaving(true);
      setError("");

      if (editing) {
        await updateHostel(id, data);
      } else {
        await createHostel(data);
      }

      navigate("/admin/hostels");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // Loading UI
  // ============================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">

          <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                <div className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="space-y-6 p-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-11 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* =========================================
            BACK BUTTON
        ========================================== */}

        <Link
          to="/admin/hostels"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hostels
        </Link>

        {/* =========================================
            PAGE HEADER
        ========================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Admin Panel
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {editing ? "Edit Hostel" : "Add Hostel"}
                  </h1>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    {editing
                      ? "Update property information, pricing, amenities and availability."
                      : "Add a new accommodation property to the StudNest platform."}
                  </p>
                </div>

              </div>

              {/* Desktop status */}
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 sm:flex">
                <Save className="h-4 w-4 text-indigo-600" />

                {editing
                  ? "Update Property"
                  : "Create Property"}
              </div>

            </div>

          </div>
        </section>

        {/* =========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to save hostel
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =========================================
            FORM CONTAINER
        ========================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Form Header */}

          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Property Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Enter accurate information about the accommodation.
                </p>
              </div>

            </div>

          </div>

          {/* Form Body */}

          <div className="p-5 sm:p-6 lg:p-8">

            <HostelForm
              hostel={hostel}
              onSubmit={submit}
              saving={saving}
            />

          </div>

        </section>

        {/* =========================================
            BOTTOM INFO
        ========================================== */}

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">

          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
            <Save className="h-4 w-4 text-indigo-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {editing
                ? "Review changes before updating"
                : "Review information before creating"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Make sure the property details, pricing, location,
              amenities and images are correct before submitting.
            </p>
          </div>

        </div>

        {/* =========================================
            SAVING OVERLAY
        ========================================== */}

        {saving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]">

            <div className="flex min-w-[260px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-2xl">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {editing
                    ? "Updating hostel..."
                    : "Creating hostel..."}
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