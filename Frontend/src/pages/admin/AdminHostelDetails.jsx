import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Building2,
  IndianRupee,
  ShieldCheck,
  Users,
  Image as ImageIcon,
  Sparkles,
  XCircle,
} from "lucide-react";

import { getAdminHostel } from "../../services/adminHostelService";
import HostelStatusBadge from "../../components/admin/HostelStatusBadge";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminHostelDetails() {
  const { id } = useParams();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminHostel(id);

      const data =
        response.data?.hostel ||
        response.data?.data ||
        response.data ||
        null;

      setHostel(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />
            </div>

            <div className="space-y-6">
              <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!hostel) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Hostel not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "The requested hostel could not be found."}
          </p>

          <Link
            to="/admin/hostels"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Link>

        </div>
      </main>
    );
  }

  // ==========================================
  // DATA
  // ==========================================

  const images =
    Array.isArray(hostel.images) &&
    hostel.images.length > 0
      ? hostel.images
      : hostel.image
        ? [hostel.image]
        : [];

  const rent = Number(
    hostel.monthlyRent || 0
  );

  const securityDeposit = Number(
    hostel.securityDeposit || 0
  );

  const gender =
    hostel.genderPreference || "Any";

  const totalRooms = Number(
    hostel.totalRooms || 0
  );

  const availableRooms = Number(
    hostel.availableRooms || 0
  );

  const rating = Number(
    hostel.rating || 0
  );

  const reviewCount = Number(
    hostel.reviewCount || 0
  );

  const status = String(
    hostel.status || "pending"
  ).toLowerCase();

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="mb-6">

          <Link
            to="/admin/hostels"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Link>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5 sm:p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">

                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                    <Building2 className="h-4 w-4" />
                    Hostel Details
                  </div>

                  <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {hostel.propertyTitle ||
                      "Untitled Hostel"}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {hostel.city || "-"}
                    </span>

                    <span className="text-slate-300">
                      •
                    </span>

                    <span>
                      {hostel.propertyType ||
                        "Hostel"}
                    </span>

                  </div>

                </div>

                <div className="shrink-0">
                  <HostelStatusBadge
                    status={status}
                  />
                </div>

              </div>

            </div>

          </section>
        </div>

        {/* =========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <span>{error}</span>

          </div>
        )}

        {/* =========================================
            MAIN GRID
        ========================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =======================================
              LEFT CONTENT
          ======================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* PROPERTY DETAILS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <SectionHeader
                icon={
                  <Building2 className="h-5 w-5 text-indigo-600" />
                }
                bg="bg-indigo-50"
                title="Property Details"
                description="Basic information about this accommodation."
              />

              <div className="space-y-6">

                {/* Description */}

                <div>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Description
                  </p>

                  <p className="text-sm leading-7 text-slate-600">
                    {hostel.description ||
                      "No description provided."}
                  </p>

                </div>

                {/* Information */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <InfoItem
                    icon={
                      <MapPin className="h-4 w-4" />
                    }
                    label="Address"
                    value={`${hostel.address || "-"}${
                      hostel.city
                        ? `, ${hostel.city}`
                        : ""
                    }`}
                  />

                  <InfoItem
                    icon={
                      <Building2 className="h-4 w-4" />
                    }
                    label="Nearby College"
                    value={
                      hostel.nearbyCollege || "-"
                    }
                  />

                  <InfoItem
                    icon={
                      <Users className="h-4 w-4" />
                    }
                    label="Gender Preference"
                    value={gender}
                  />

                  <InfoItem
                    icon={
                      <IndianRupee className="h-4 w-4" />
                    }
                    label="Monthly Rent"
                    value={`₹${rent.toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <InfoItem
                    icon={
                      <ShieldCheck className="h-4 w-4" />
                    }
                    label="Security Deposit"
                    value={`₹${securityDeposit.toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <InfoItem
                    icon={
                      <Building2 className="h-4 w-4" />
                    }
                    label="Property Type"
                    value={
                      hostel.propertyType ||
                      "Hostel"
                    }
                  />

                </div>

              </div>

            </section>

            {/* =====================================
                AMENITIES
            ====================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <SectionHeader
                icon={
                  <Sparkles className="h-5 w-5 text-amber-600" />
                }
                bg="bg-amber-50"
                title="Amenities"
                description="Facilities provided by this property."
              />

              {Array.isArray(hostel.amenities) &&
              hostel.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">

                  {hostel.amenities.map(
                    (amenity, index) => (
                      <span
                        key={`${amenity}-${index}`}
                        className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                      >
                        {amenity}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No amenities listed.
                </div>
              )}

            </section>

            {/* =====================================
                IMAGES
            ====================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <SectionHeader
                icon={
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                }
                bg="bg-purple-50"
                title="Property Images"
                description={`${images.length} ${
                  images.length === 1
                    ? "image"
                    : "images"
                } uploaded`}
              />

              {images.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {images.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
                      >

                        <img
                          src={image}
                          alt={`${hostel.propertyTitle || "Hostel"} ${
                            index + 1
                          }`}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        {index === 0 && (
                          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow">
                            Main Image
                          </div>
                        )}

                        <div className="absolute right-3 top-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white">
                          {index + 1}
                        </div>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="flex h-56 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">

                  <div className="text-center">

                    <ImageIcon className="mx-auto h-9 w-9 text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No images available
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Edit this hostel to upload images.
                    </p>

                  </div>

                </div>
              )}

            </section>

          </div>

          {/* =======================================
              RIGHT SIDEBAR
          ======================================== */}

          <aside className="space-y-6">

            {/* PROPERTY STATS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-base font-bold text-slate-900">
                Property Stats
              </h2>

              <div className="space-y-3">

                <Stat
                  label="Total Rooms"
                  value={totalRooms}
                />

                <Stat
                  label="Available Rooms"
                  value={availableRooms}
                />

                <Stat
                  label="Occupied Rooms"
                  value={Math.max(
                    totalRooms -
                      availableRooms,
                    0
                  )}
                />

                <Stat
                  label="Rating"
                  value={`${rating.toFixed(
                    1
                  )} / 5`}
                />

                <Stat
                  label="Reviews"
                  value={reviewCount}
                />

              </div>

            </section>

            {/* OWNER */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-base font-bold text-slate-900">
                Owner Information
              </h2>

              <div className="space-y-4">

                <OwnerItem
                  label="Name"
                  value={
                    hostel.ownerName || "-"
                  }
                />

                <OwnerItem
                  label="Email"
                  value={
                    hostel.ownerEmail || "-"
                  }
                />

                <OwnerItem
                  label="Phone"
                  value={
                    hostel.ownerPhone || "-"
                  }
                />

              </div>

            </section>

            {/* =====================================
                MANAGE HOSTEL
            ====================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">

              <h2 className="text-base font-bold text-slate-900">
                Manage Hostel
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Update property information, manage
                rooms, pricing, amenities and images.
              </p>

              <div className="mt-5 space-y-3">

                {/* MANAGE ROOMS */}

                <Link
                  to={`/admin/rooms?hostelId=${id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Users className="h-4 w-4" />
                  Manage Rooms
                </Link>

                {/* EDIT HOSTEL */}

                <Link
                  to={`/admin/hostels/${id}/edit`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Hostel
                </Link>

                {/* BACK */}

                <Link
                  to="/admin/hostels"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Hostels
                </Link>

              </div>

            </section>

          </aside>

        </div>
      </div>
    </main>
  );
}


// ==========================================
// SECTION HEADER
// ==========================================

function SectionHeader({
  icon,
  bg,
  title,
  description,
}) {
  return (
    <div className="mb-5 flex items-center gap-3">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
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
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="mb-2 flex items-center gap-2 text-indigo-600">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="break-words text-sm font-medium leading-6 text-slate-800">
        {value}
      </p>

    </div>
  );
}


// ==========================================
// STAT
// ==========================================

function Stat({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}


// ==========================================
// OWNER ITEM
// ==========================================

function OwnerItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}