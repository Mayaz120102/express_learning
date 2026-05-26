import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import goruAxios from "../api/goruAxios";

const GoruCowList = () => {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCows = async () => {
      try {
        const { data } = await goruAxios.get("/cows");
        setCows(data.cows);
      } catch (err) {
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchCows();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-green-700 text-lg animate-pulse">
          Loading cows...
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (cows.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🐄</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
          No cows listed yet
        </h2>
        <p className="text-gray-400">Be the first to list a cow!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-green-700">Browse Cows</h1>
        <span className="text-gray-500 text-sm">{cows.length} listings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cows.map((cow) => (
          <GoruCowCard key={cow._id} cow={cow} />
        ))}
      </div>
    </div>
  );
};

// Cow Card component — defined in same file for now
const GoruCowCard = ({ cow }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      {/* Image */}
      <div className="h-48 bg-green-50 flex items-center justify-center">
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

      {/* Details */}
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
};

export default GoruCowList;
