import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import goruAxios from "../api/goruAxios";
import userGoruAuth from "../hooks/userGoruAuth";

const GoruCowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goruUser, isAuthenticated } = userGoruAuth();

  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCow = async () => {
      try {
        const { data } = await goruAxios.get(`/cows/${id}`);
        setCow(data.cow);
      } catch (err) {
        setError("Cow not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCow();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await goruAxios.delete(`/cows/${id}`);
      navigate("/cows");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="text-green-700 animate-pulse text-lg">Loading...</div>
      </div>
    );

  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  const isOwner = goruUser?._id === cow?.seller?._id;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Image */}
      <div className="bg-green-50 rounded-2xl h-80 flex items-center justify-center mb-8 overflow-hidden">
        {cow.images?.length > 0 ? (
          <img
            src={cow.images[0]}
            alt={cow.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <span className="text-9xl">🐄</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{cow.title}</h1>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {cow.breed}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: "Age", value: `${cow.age} years`, icon: "🎂" },
              { label: "Weight", value: `${cow.weight} kg`, icon: "⚖️" },
              { label: "District", value: cow.district, icon: "📍" },
              {
                label: "Status",
                value: cow.isAvailable ? "Available" : "Sold",
                icon: "✅",
              },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  {icon} {label}
                </p>
                <p className="font-semibold text-gray-800 mt-1">{value}</p>
              </div>
            ))}
          </div>

          {cow.description && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{cow.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="bg-green-700 text-white rounded-2xl p-6 text-center">
            <p className="text-green-200 text-sm mb-1">Price</p>
            <p className="text-4xl font-bold">৳{cow.price?.toLocaleString()}</p>
          </div>

          {/* Seller info */}
          <div className="bg-white border rounded-2xl p-5">
            <h3 className="font-semibold text-gray-700 mb-3">Seller Info</h3>
            <div className="space-y-2 text-sm">
              <p>👤 {cow.seller?.name}</p>
              <p>📍 {cow.seller?.district}</p>
              <p>📞 {cow.seller?.phone || "Not provided"}</p>
            </div>
          </div>

          {/* Action buttons */}
          {isOwner && (
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/cows/${id}/edit`)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Edit Listing
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Delete Listing
              </button>
            </div>
          )}

          {!isOwner && isAuthenticated && (
            <button className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition font-semibold">
              Contact Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoruCowDetail;
