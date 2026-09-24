import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  Users,
  Sparkles,
  FileText,
  Save,
  Loader2,
  ImagePlus,
  X,
  Upload,
  Crosshair,
  CheckCircle2,
} from "lucide-react";

const initialForm = {
  propertyTitle: "",
  propertyType: "Hostel",
  description: "",
  address: "",
  city: "",
  nearbyCollege: "",
  genderPreference: "Any",
  monthlyRent: "",
  securityDeposit: "",
  totalRooms: "",
  availableRooms: "",
  latitude: "",
  longitude: "",
};

export default function HostelForm({
  hostel,
  onSubmit,
  saving,
}) {
  const [form, setForm] = useState(initialForm);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [locationMessage, setLocationMessage] =
    useState("");

  // =========================================
  // LOAD HOSTEL DATA
  // =========================================

  useEffect(() => {
    if (!hostel) {
      setForm(initialForm);
      setImages([]);
      setExistingImages([]);
      setLocationError("");
      setLocationMessage("");
      return;
    }

    const hostelImages =
      Array.isArray(hostel.images)
        ? hostel.images
        : hostel.image
          ? [hostel.image]
          : [];

    setExistingImages(hostelImages);

    // -----------------------------------------
    // EXISTING LOCATION
    // -----------------------------------------

    const coordinates =
      hostel?.location?.coordinates;

    let longitude = "";
    let latitude = "";

    if (
      Array.isArray(coordinates) &&
      coordinates.length === 2
    ) {
      longitude = coordinates[0] ?? "";
      latitude = coordinates[1] ?? "";
    }

    setForm({
      propertyTitle:
        hostel.propertyTitle || "",

      propertyType:
        hostel.propertyType || "Hostel",

      description:
        hostel.description || "",

      address:
        hostel.address || "",

      city:
        hostel.city || "",

      nearbyCollege:
        hostel.nearbyCollege || "",

      genderPreference:
        hostel.genderPreference ||
        hostel.gender ||
        "Any",

      monthlyRent:
        hostel.monthlyRent ??
        hostel.rent ??
        "",

      securityDeposit:
        hostel.securityDeposit ?? "",

      totalRooms:
        hostel.totalRooms ?? "",

      availableRooms:
        hostel.availableRooms ?? "",

      amenities:
        Array.isArray(hostel.amenities)
          ? hostel.amenities.join(", ")
          : hostel.amenities || "",

      latitude,
      longitude,
    });

    setImages([]);

    setLocationError("");
    setLocationMessage(
      latitude !== "" &&
        longitude !== ""
        ? "Saved location loaded."
        : ""
    );
  }, [hostel]);

  // =========================================
  // FIELD CHANGE
  // =========================================

  const change = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));

    if (
      key === "latitude" ||
      key === "longitude"
    ) {
      setLocationError("");
      setLocationMessage("");
    }
  };

  // =========================================
  // GET CURRENT LOCATION
  // =========================================

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);
    setLocationError("");
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =
          position.coords;

        setForm((current) => ({
          ...current,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setLocationMessage(
          "Current location captured successfully."
        );

        setLocationLoading(false);
      },

      (error) => {
        console.error(
          "Admin hostel location error:",
          error
        );

        const messages = {
          1:
            "Location permission was denied. Please allow location access.",
          2:
            "Unable to determine your location.",
          3:
            "Location request timed out. Please try again.",
        };

        setLocationError(
          messages[error.code] ||
            "Unable to get your current location."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  // =========================================
  // IMAGE CHANGE
  // =========================================

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) return;

    const validImages = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 5 * 1024 * 1024
    );

    setImages((current) => {
      const combined = [
        ...current,
        ...validImages,
      ];

      const unique = combined.filter(
        (file, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified ===
                file.lastModified
          )
      );

      return unique.slice(0, 8);
    });

    event.target.value = "";
  };

  // =========================================
  // REMOVE NEW IMAGE
  // =========================================

  const removeNewImage = (index) => {
    setImages((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  // =========================================
  // REMOVE EXISTING IMAGE
  // =========================================

  const removeExistingImage = (index) => {
    setExistingImages((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  // =========================================
  // SUBMIT
  // =========================================

  const submit = (event) => {
    event.preventDefault();

    if (!form.propertyTitle.trim()) {
      alert("Property title is required.");
      return;
    }

    if (!form.address.trim()) {
      alert("Address is required.");
      return;
    }

    if (!form.city.trim()) {
      alert("City is required.");
      return;
    }

    // =======================================
    // LOCATION VALIDATION
    // =======================================

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!Number.isFinite(latitude)) {
      alert(
        "Please provide a valid latitude or use your current location."
      );
      return;
    }

    if (!Number.isFinite(longitude)) {
      alert(
        "Please provide a valid longitude or use your current location."
      );
      return;
    }

    if (latitude < -90 || latitude > 90) {
      alert(
        "Latitude must be between -90 and 90."
      );
      return;
    }

    if (
      longitude < -180 ||
      longitude > 180
    ) {
      alert(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    // Prevent [0, 0]
    if (
      latitude === 0 &&
      longitude === 0
    ) {
      alert(
        "Please provide the actual property location."
      );
      return;
    }

    const totalRooms = Number(
      form.totalRooms || 0
    );

    const availableRooms =
      form.availableRooms === ""
        ? totalRooms
        : Number(form.availableRooms);

    if (
      availableRooms > totalRooms &&
      totalRooms > 0
    ) {
      alert(
        "Available rooms cannot be greater than total rooms."
      );
      return;
    }

    if (availableRooms < 0) {
      alert(
        "Available rooms cannot be negative."
      );
      return;
    }

    // =======================================
    // FORM DATA
    // =======================================

    const formData = new FormData();

    formData.append(
      "propertyTitle",
      form.propertyTitle.trim()
    );

    formData.append(
      "propertyType",
      form.propertyType
    );

    formData.append(
      "description",
      form.description.trim()
    );

    formData.append(
      "address",
      form.address.trim()
    );

    formData.append(
      "city",
      form.city.trim()
    );

    formData.append(
      "nearbyCollege",
      form.nearbyCollege.trim()
    );

    formData.append(
      "genderPreference",
      form.genderPreference
    );

    formData.append(
      "monthlyRent",
      String(
        Number(form.monthlyRent || 0)
      )
    );

    formData.append(
      "securityDeposit",
      String(
        Number(
          form.securityDeposit || 0
        )
      )
    );

    formData.append(
      "totalRooms",
      String(totalRooms)
    );

    formData.append(
      "availableRooms",
      String(availableRooms)
    );

    // =======================================
    // LOCATION
    // =======================================

    formData.append(
      "location",
      JSON.stringify({
        type: "Point",
        coordinates: [
          longitude,
          latitude,
        ],
      })
    );

    // =======================================
    // AMENITIES
    // =======================================

    const amenities = form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    formData.append(
      "amenities",
      JSON.stringify(amenities)
    );

    // =======================================
    // EXISTING IMAGES
    // =======================================

    formData.append(
      "existingImages",
      JSON.stringify(existingImages)
    );

    // =======================================
    // NEW IMAGES
    // =======================================

    images.forEach((image) => {
      formData.append("images", image);
    });

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-8"
    >
      {/* =========================================
          BASIC INFORMATION
      ========================================== */}

      <section>
        <SectionHeader
          icon={
            <FileText className="h-5 w-5 text-indigo-600" />
          }
          iconBg="bg-indigo-50"
          title="Basic Information"
          description="Enter the basic details of the property."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="Property Title"
            required
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <input
              type="text"
              value={form.propertyTitle}
              onChange={change("propertyTitle")}
              placeholder="e.g. Sunrise Boys Hostel"
              required
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Property Type"
            required
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <select
              value={form.propertyType}
              onChange={change("propertyType")}
              className={inputClass}
            >
              <option value="Hostel">
                Hostel
              </option>

              <option value="PG">
                PG
              </option>

              <option value="Room">
                Room
              </option>

              <option value="Apartment">
                Apartment
              </option>

              <option value="Flat">
                Flat
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Description"
              icon={
                <FileText className="h-4 w-4" />
              }
            >
              <textarea
                value={form.description}
                onChange={change("description")}
                placeholder="Describe the property, facilities, rules and other important information..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </FormField>
          </div>
        </div>
      </section>

      {/* =========================================
          IMAGES
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">
        <SectionHeader
          icon={
            <ImagePlus className="h-5 w-5 text-pink-600" />
          }
          iconBg="bg-pink-50"
          title="Property Images"
          description="Upload up to 8 property images. Each image can be up to 5MB."
        />

        <div className="space-y-5">
          <label
            htmlFor="hostel-images"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              Click to upload property images
            </p>

            <p className="mt-1 text-xs text-slate-500">
              JPG, JPEG, PNG or WEBP · Maximum 8
              images · 5MB each
            </p>

            <input
              id="hostel-images"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Existing Images */}

          {existingImages.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Existing Images
                </p>

                <span className="text-xs text-slate-400">
                  {existingImages.length} image
                  {existingImages.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {existingImages.map(
                  (image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={image}
                        alt={`Existing hostel ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/75 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow">
                          Main Image
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* New Images */}

          {images.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  New Images
                </p>

                <span className="text-xs text-slate-400">
                  {images.length}/8 selected
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map(
                  (file, index) => (
                    <ImagePreview
                      key={`${file.name}-${file.lastModified}-${index}`}
                      file={file}
                      index={index}
                      onRemove={() =>
                        removeNewImage(index)
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}

          {existingImages.length === 0 &&
            images.length === 0 && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
                No images selected yet.
              </div>
            )}
        </div>
      </section>

      {/* =========================================
          LOCATION
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">
        <SectionHeader
          icon={
            <MapPin className="h-5 w-5 text-emerald-600" />
          }
          iconBg="bg-emerald-50"
          title="Location"
          description="Add the property's address and exact map location."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* ADDRESS */}

          <div className="md:col-span-2">
            <FormField
              label="Address"
              required
              icon={
                <MapPin className="h-4 w-4" />
              }
            >
              <input
                type="text"
                value={form.address}
                onChange={change("address")}
                placeholder="Enter complete property address"
                required
                className={inputClass}
              />
            </FormField>
          </div>

          {/* CITY */}

          <FormField
            label="City"
            required
            icon={
              <MapPin className="h-4 w-4" />
            }
          >
            <input
              type="text"
              value={form.city}
              onChange={change("city")}
              placeholder="e.g. Noida"
              required
              className={inputClass}
            />
          </FormField>

          {/* COLLEGE */}

          <FormField
            label="Nearby College"
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <input
              type="text"
              value={form.nearbyCollege}
              onChange={change("nearbyCollege")}
              placeholder="e.g. Amity University"
              className={inputClass}
            />
          </FormField>

          {/* =====================================
              CURRENT LOCATION BUTTON
          ====================================== */}

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Property Map Location
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use the property's actual location so
                    students can find it in Nearby Hostels.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  disabled={locationLoading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Crosshair className="h-4 w-4" />
                      Use Current Location
                    </>
                  )}
                </button>
              </div>

              {/* LOCATION MESSAGE */}

              {locationMessage && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {locationMessage}
                </div>
              )}

              {/* LOCATION ERROR */}

              {locationError && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-600">
                  {locationError}
                </p>
              )}

              {/* =================================
                  COORDINATES
              ================================== */}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <FormField
                  label="Latitude"
                  required
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                >
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={form.latitude}
                    onChange={change("latitude")}
                    placeholder="e.g. 28.6139"
                    required
                    className={inputClass}
                  />

                  <p className="text-[11px] text-slate-400">
                    Range: -90 to 90
                  </p>
                </FormField>

                <FormField
                  label="Longitude"
                  required
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                >
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={form.longitude}
                    onChange={change("longitude")}
                    placeholder="e.g. 77.2090"
                    required
                    className={inputClass}
                  />

                  <p className="text-[11px] text-slate-400">
                    Range: -180 to 180
                  </p>
                </FormField>

              </div>

              {/* COORDINATE PREVIEW */}

              {form.latitude &&
                form.longitude && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold text-slate-500">
                      Saved Map Coordinates
                    </p>

                    <p className="mt-1 font-mono text-sm font-bold text-emerald-700">
                      {form.latitude},{" "}
                      {form.longitude}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          PRICING
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">
        <SectionHeader
          icon={
            <IndianRupee className="h-5 w-5 text-amber-600" />
          }
          iconBg="bg-amber-50"
          title="Pricing & Preference"
          description="Set rent, security deposit and gender preference."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <FormField
            label="Monthly Rent"
            required
            icon={
              <IndianRupee className="h-4 w-4" />
            }
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={form.monthlyRent}
                onChange={change("monthlyRent")}
                placeholder="5000"
                required
                className={`${inputClass} pl-8`}
              />
            </div>
          </FormField>

          <FormField
            label="Security Deposit"
            icon={
              <IndianRupee className="h-4 w-4" />
            }
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={form.securityDeposit}
                onChange={change("securityDeposit")}
                placeholder="10000"
                className={`${inputClass} pl-8`}
              />
            </div>
          </FormField>

          <FormField
            label="Gender Preference"
            required
            icon={
              <Users className="h-4 w-4" />
            }
          >
            <select
              value={form.genderPreference}
              onChange={change("genderPreference")}
              required
              className={inputClass}
            >
              <option value="Any">
                Any
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>
            </select>
          </FormField>
        </div>
      </section>

      {/* =========================================
          ROOM CAPACITY
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">
        <SectionHeader
          icon={
            <Users className="h-5 w-5 text-cyan-600" />
          }
          iconBg="bg-cyan-50"
          title="Room Capacity"
          description="Set the total and currently available rooms."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <FormField
            label="Total Rooms"
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <input
              type="number"
              min="0"
              value={form.totalRooms}
              onChange={change("totalRooms")}
              placeholder="20"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Available Rooms"
            icon={
              <Users className="h-4 w-4" />
            }
          >
            <input
              type="number"
              min="0"
              value={form.availableRooms}
              onChange={change("availableRooms")}
              placeholder="20"
              className={inputClass}
            />
          </FormField>
        </div>
      </section>

      {/* =========================================
          AMENITIES
      ========================================== */}

      <section className="border-t border-slate-100 pt-8">
        <SectionHeader
          icon={
            <Sparkles className="h-5 w-5 text-purple-600" />
          }
          iconBg="bg-purple-50"
          title="Amenities"
          description="Add facilities available at the property."
        />

        <FormField
          label="Amenities"
          icon={
            <Sparkles className="h-4 w-4" />
          }
          hint="Separate multiple amenities with commas"
        >
          <input
            type="text"
            value={form.amenities}
            onChange={change("amenities")}
            placeholder="WiFi, Food, Laundry, Parking, AC"
            className={inputClass}
          />
        </FormField>

        {form.amenities && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
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
              {hostel
                ? "Update Hostel"
                : "Create Hostel"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ==========================================
// SECTION HEADER
// ==========================================

function SectionHeader({
  icon,
  iconBg,
  title,
  description,
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900">
          {title}
        </h3>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// IMAGE PREVIEW
// ==========================================

function ImagePreview({
  file,
  index,
  onRemove,
}) {
  const [preview, setPreview] =
    useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

      {preview && (
        <img
          src={preview}
          alt={`New hostel ${index + 1}`}
          className="h-36 w-full object-cover"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/75 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      {index === 0 && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow">
          Main Image
        </span>
      )}
    </div>
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
        <p className="text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

// ==========================================
// INPUT STYLE
// ==========================================

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";