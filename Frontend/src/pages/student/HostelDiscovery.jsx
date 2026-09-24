import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaStar,
  FaSlidersH,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
} from "react-icons/fa";

import HostelCard from "../../components/hostel/HostelCard";
import { getHostels } from "../../services/hostelService";
import { getApiErrorMessage } from "../../utils/apiError";

const initialFilters = {
  search: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  gender: "",
  propertyType: "",
  minRating: "",
  sort: "ratingHigh",
  page: 1,
  limit: 12,
};

export default function HostelDiscovery() {
  const [filters, setFilters] = useState(initialFilters);

  const [allHostels, setAllHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHostels = async () => {
    try {
      setLoading(true);
      setError("");

      // Current backend returns:
      // { count, hostels }
      const response = await getHostels();

      const data =
        response.data?.hostels ||
        response.data?.data ||
        [];

      setAllHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadHostels error:", err);
      setError(getApiErrorMessage(err));
      setAllHostels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const filteredHostels = useMemo(() => {
    let result = [...allHostels];

    const search = filters.search.trim().toLowerCase();
    const city = filters.city.trim().toLowerCase();

    // Search
    if (search) {
      result = result.filter((hostel) => {
        const title =
          hostel?.propertyTitle?.toLowerCase() || "";

        const hostelCity =
          hostel?.city?.toLowerCase() || "";

        const college =
          hostel?.nearbyCollege?.toLowerCase() || "";

        const address =
          hostel?.address?.toLowerCase() || "";

        const description =
          hostel?.description?.toLowerCase() || "";

        return (
          title.includes(search) ||
          hostelCity.includes(search) ||
          college.includes(search) ||
          address.includes(search) ||
          description.includes(search)
        );
      });
    }

    // City
    if (city) {
      result = result.filter((hostel) =>
        String(hostel?.city || "")
          .toLowerCase()
          .includes(city)
      );
    }

    // Minimum price
    if (filters.minPrice !== "") {
      const minPrice = Number(filters.minPrice);

      result = result.filter(
        (hostel) =>
          Number(hostel?.monthlyRent || 0) >= minPrice
      );
    }

    // Maximum price
    if (filters.maxPrice !== "") {
      const maxPrice = Number(filters.maxPrice);

      result = result.filter(
        (hostel) =>
          Number(hostel?.monthlyRent || 0) <= maxPrice
      );
    }

    // Gender
    if (filters.gender) {
      result = result.filter(
        (hostel) =>
          hostel?.genderPreference === filters.gender
      );
    }

    // Property type
    if (filters.propertyType) {
      result = result.filter(
        (hostel) =>
          hostel?.propertyType === filters.propertyType
      );
    }

    // Minimum rating
    if (filters.minRating !== "") {
      const minRating = Number(filters.minRating);

      result = result.filter(
        (hostel) =>
          Number(hostel?.rating || 0) >= minRating
      );
    }

    // Sorting
    result.sort((a, b) => {
      const ratingA = Number(a?.rating || 0);
      const ratingB = Number(b?.rating || 0);

      const rentA = Number(a?.monthlyRent || 0);
      const rentB = Number(b?.monthlyRent || 0);

      const dateA = new Date(a?.createdAt || 0).getTime();
      const dateB = new Date(b?.createdAt || 0).getTime();

      switch (filters.sort) {
        case "priceLow":
          return rentA - rentB;

        case "priceHigh":
          return rentB - rentA;

        case "newest":
          return dateB - dateA;

        case "ratingHigh":
        default:
          return ratingB - ratingA;
      }
    });

    return result;
  }, [allHostels, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredHostels.length / filters.limit
    )
  );

  const currentPage =
    Math.min(filters.page, totalPages);

  const paginatedHostels = useMemo(() => {
    const start =
      (currentPage - 1) * filters.limit;

    const end = start + filters.limit;

    return filteredHostels.slice(start, end);
  }, [
    filteredHostels,
    currentPage,
    filters.limit,
  ]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const submitSearch = (event) => {
    event.preventDefault();

    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleRetry = () => {
    loadHostels();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500";

  const selectClass =
    "w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            <FaSearch className="text-xs" />
            StudNest Discovery
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Find your next home
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Search hostels and compare pricing, locations,
            property types and ratings to find the perfect
            stay.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <FaSlidersH />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Find your ideal hostel
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use filters to narrow down your search
              </p>
            </div>
          </div>

          <form onSubmit={submitSearch}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

              {/* Search */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Search
                </label>

                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      updateFilter(
                        "search",
                        e.target.value
                      )
                    }
                    placeholder="Hostel, college, city or location"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  City
                </label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) =>
                      updateFilter(
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="Enter city"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Gender
                </label>

                <select
                  value={filters.gender}
                  onChange={(e) =>
                    updateFilter(
                      "gender",
                      e.target.value
                    )
                  }
                  className={selectClass}
                >
                  <option value="">
                    All genders
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Any">
                    Any
                  </option>
                </select>
              </div>

              {/* Minimum Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Minimum Rent
                </label>

                <div className="relative">
                  <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) =>
                      updateFilter(
                        "minPrice",
                        e.target.value
                      )
                    }
                    placeholder="Minimum"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Maximum Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Maximum Rent
                </label>

                <div className="relative">
                  <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      updateFilter(
                        "maxPrice",
                        e.target.value
                      )
                    }
                    placeholder="Maximum"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Property Type
                </label>

                <div className="relative">
                  <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      updateFilter(
                        "propertyType",
                        e.target.value
                      )
                    }
                    className={`${selectClass} pl-11`}
                  >
                    <option value="">
                      All property types
                    </option>

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
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Minimum Rating
                </label>

                <div className="relative">
                  <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />

                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      updateFilter(
                        "minRating",
                        e.target.value
                      )
                    }
                    className={`${selectClass} pl-11`}
                  >
                    <option value="">
                      Any rating
                    </option>

                    <option value="4">
                      4+ ⭐
                    </option>

                    <option value="3">
                      3+ ⭐
                    </option>

                    <option value="2">
                      2+ ⭐
                    </option>

                    <option value="1">
                      1+ ⭐
                    </option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sort By
                </label>

                <select
                  value={filters.sort}
                  onChange={(e) =>
                    updateFilter(
                      "sort",
                      e.target.value
                    )
                  }
                  className={selectClass}
                >
                  <option value="ratingHigh">
                    Top Rated
                  </option>

                  <option value="priceLow">
                    Price: Low to High
                  </option>

                  <option value="priceHigh">
                    Price: High to Low
                  </option>

                  <option value="newest">
                    Newest
                  </option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FaRedo className="text-xs" />
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-lg"
              >
                <FaSearch />
                Search Hostels
              </button>
            </div>
          </form>
        </section>

        {/* Results */}
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Discover
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                Available Hostels
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {loading
                  ? "Finding hostels..."
                  : `${filteredHostels.length} hostel${
                      filteredHostels.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>

            {!loading && !error && (
              <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                {filteredHostels.length} Results
              </div>
            )}
          </div>

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                !
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white">
                Unable to load hostels
              </h3>

              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <FaRedo />
                Try Again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <HostelSkeleton key={index} />
                )
              )}
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredHostels.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <FaSearch className="text-xl" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No matching hostels
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We couldn't find any hostels matching
                  your current filters. Try changing your
                  search criteria.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <FaRedo />
                  Clear Filters
                </button>
              </div>
            )}

          {/* Hostel Grid */}
          {!loading &&
            !error &&
            paginatedHostels.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedHostels.map((hostel) => (
                  <HostelCard
                    key={hostel._id}
                    hostel={hostel}
                  />
                ))}
              </div>
            )}

          {/* Pagination */}
          {!loading &&
            !error &&
            filteredHostels.length > filters.limit && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.max(
                        1,
                        prev.page - 1
                      ),
                    }))
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
                >
                  <FaChevronLeft className="text-xs" />
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    Page {currentPage} of{" "}
                    {totalPages}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {filteredHostels.length} total
                    results
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    currentPage >= totalPages
                  }
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.min(
                        totalPages,
                        prev.page + 1
                      ),
                    }))
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

function HostelSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

        <div className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}