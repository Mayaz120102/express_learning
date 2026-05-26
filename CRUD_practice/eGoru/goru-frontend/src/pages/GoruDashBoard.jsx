import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userGoruAuth from "../hooks/userGoruAuth";
import goruAxios from "../api/goruAxios";

const GoruDashboard = () => {
  const { goruUser } = userGoruAuth();
  const navigate = useNavigate();
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCows = async () => {
      try {
        const { data } = await goruAxios.get("/cows/seller/my-cows");
        setCows(data.cows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCows();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await goruAxios.delete(`/cows/${id}`);
      setCows(cows.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-700">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {goruUser?.name}</p>
        </div>
        <Link
          to="/cows/add"
          className="bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 transition font-semibold"
        >
          + List New Cow
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-3xl font-bold text-green-700">{cows.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total Listings</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-3xl font-bold text-green-700">
            {cows.filter((c) => c.isAvailable).length}
          </p>
          <p className="text-gray-500 text-sm mt-1">Available</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-3xl font-bold text-green-700">
            {cows.filter((c) => !c.isAvailable).length}
          </p>
          <p className="text-gray-500 text-sm mt-1">Sold</p>
        </div>
      </div>

      {/* Listings table */}
      {loading ? (
        <div className="text-center py-10 text-green-700 animate-pulse">
          Loading...
        </div>
      ) : cows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow">
          <div className="text-6xl mb-4">🐄</div>
          <p className="text-gray-500 mb-4">No listings yet</p>
          <Link
            to="/cows/add"
            className="bg-green-700 text-white px-6 py-2.5 rounded-lg hover:bg-green-800 transition"
          >
            List Your First Cow
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Breed</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cows.map((cow) => (
                <tr key={cow._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {cow.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cow.breed}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">
                    ৳{cow.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cow.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cow.isAvailable ? "Available" : "Sold"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/cows/${cow._id}/edit`)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cow._id)}
                        className="text-red-500 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GoruDashboard;
