import { debounce } from "lodash";
import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import goruAxios from "../api/goruAxios";

// Bangladesh districts for the dropdown
const BD_DISTRICTS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Tangail",
  "Bogura",
  "Dinajpur",
  "Jessore",
];

const BREEDS = [
  "Brahman",
  "Shahiwal",
  "Friesian",
  "Local",
  "Hariana",
  "Sindhi",
  "Red Chittagong",
  "Pabna",
  "North Bengal Grey",
];

const GoruCowList = () => {
  // useSearchParams keeps filters in the URL — shareable and back-button friendly
  const [searchParams, setSearchParams] = useSearchParams();

  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Read current filter values from URL
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    district: searchParams.get("district") || "",
    breed: searchParams.get("breed") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  // useCallback prevents the function from being recreated on every render
  // debounce wraps it so it only fires 500ms after the last call
  const fetchCows = useCallback(
    debounce(async (page = 1) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", 9);
        Object.entries(filters).forEach(([key, val]) => {
          if (val) params.set(key, val);
        });

        const { data } = await goruAxios.get(`/cows?${params.toString()}`);
        setCows(data.cows);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      } catch (err) {
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    [filters], // recreate when filters change
  );
  // Fetch whenever filters change
  useEffect(() => {
    fetchCows(1);

    return () => fetchCows.cancel();
  }, [fetchCows]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCows(1);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      district: "",
      breed: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    setSearchParams({});
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-700">Browse Cows</h1>
        <span className="text-gray-500 text-sm">{total} listings found</span>
      </div>

      {/* ── FILTER BAR ── */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-sm border p-5 mb-8"
      >
        {/* Search + Sort row */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by title, breed, description..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="weight_high">Heaviest First</option>
          </select>
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
            className={inputClass}
          >
            <option value="">All Districts</option>
            {BD_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            name="breed"
            value={filters.breed}
            onChange={handleFilterChange}
            className={inputClass}
          >
            <option value="">All Breeds</option>
            {BREEDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min price (৳)"
            className={inputClass}
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max price (৳)"
            className={inputClass}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-800 transition font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* ── COW GRID ── */}
      {loading ? (
        <GoruCowSkeleton />
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : cows.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🐄</div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">
            No cows found
          </h2>
          <p className="text-gray-400">Try adjusting your filters</p>
          <button
            onClick={handleReset}
            className="mt-4 text-green-700 hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cows.map((cow) => (
              <GoruCowCard key={cow._id} cow={cow} />
            ))}
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => fetchCows(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchCows(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    p === currentPage
                      ? "bg-green-700 text-white"
                      : "border hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => fetchCows(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── LOADING SKELETON ──────────────────────────────────────────────
// Shows placeholder cards while data loads — better UX than a spinner
const GoruCowSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
      >
        <div className="h-48 bg-gray-200" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-8 bg-gray-200 rounded w-full mt-4" />
        </div>
      </div>
    ))}
  </div>
);

// ── COW CARD ─────────────────────────────────────────────────────
const GoruCowCard = ({ cow }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
    <div className="h-48 bg-green-50 flex items-center justify-center overflow-hidden">
      {cow.images?.length > 0 ? (
        <img
          src={cow.images[0]}
          alt={cow.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-7xl">🐄</span>
      )}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">
          {cow.title}
        </h3>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full ml-2 shrink-0">
          {cow.breed}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <span>🎂 {cow.age} years</span>
        <span>⚖️ {cow.weight} kg</span>
        <span>📍 {cow.district}</span>
        <span>👤 {cow.seller?.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-green-700">
          ৳{cow.price?.toLocaleString()}
        </span>
        <Link
          to={`/cows/${cow._id}`}
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default GoruCowList;
