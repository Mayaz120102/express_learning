import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import goruAxios from "../api/goruAxios";
import userGoruAuth from "../hooks/userGoruAuth";

const GoruCowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goruUser } = userGoruAuth();

  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Order form state
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    district: "",
    details: "",
    note: "",
  });

  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const fetchCow = async () => {
      try {
        const { data } = await goruAxios.get(`/cows/${id}`);
        setCow(data.cow);
      } catch {
        setError("Cow not found");
      } finally {
        setLoading(false);
      }
    };

    fetchCow();
  }, [id]);

  // Delete listing
  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await goruAxios.delete(`/cows/${id}`);

      toast.success("Listing deleted");

      navigate("/cows");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // Place order
  const handleOrder = async (e) => {
    e.preventDefault();

    setOrdering(true);
    setOrderError("");

    try {
      await goruAxios.post("/orders", {
        cowId: id,
        deliveryAddress: {
          district: orderData.district,
          details: orderData.details,
        },
        note: orderData.note,
      });

      toast.success("Order placed successfully!");

      setShowOrderForm(false);

      navigate("/my-orders");
    } catch (err) {
      const message = err.response?.data?.message || "Order failed";

      setOrderError(message);

      toast.error(message);
    } finally {
      setOrdering(false);
    }
  };

  // Skeleton loading UI
  if (loading)
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        {/* Image skeleton */}
        <div className="bg-gray-200 rounded-2xl h-80 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl" />
              ))}
            </div>

            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>

          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );

  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  const isOwner = goruUser?._id === cow?.seller?._id;
  const isBuyer = goruUser?.role === "buyer";

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
              {
                label: "Age",
                value: `${cow.age} years`,
                icon: "🎂",
              },
              {
                label: "Weight",
                value: `${cow.weight} kg`,
                icon: "⚖️",
              },
              {
                label: "District",
                value: cow.district,
                icon: "📍",
              },
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
          {/* Price */}
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

          {/* Owner actions */}
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

          {/* Buyer actions */}
          {isBuyer && cow.isAvailable && (
            <button
              onClick={() => setShowOrderForm(!showOrderForm)}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition font-semibold"
            >
              {showOrderForm ? "Cancel" : "Place Order"}
            </button>
          )}

          {/* Sold state */}
          {!cow.isAvailable && (
            <div className="bg-gray-100 text-gray-500 rounded-xl p-4 text-center text-sm font-medium">
              This cow has been sold
            </div>
          )}
        </div>
      </div>

      {/* Order form */}
      {showOrderForm && (
        <div className="mt-8 bg-white border rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Place Your Order
          </h3>

          {orderError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              {orderError}
            </div>
          )}

          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery District
              </label>

              <input
                type="text"
                value={orderData.district}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    district: e.target.value,
                  })
                }
                placeholder="Your district"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address
              </label>

              <input
                type="text"
                value={orderData.details}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    details: e.target.value,
                  })
                }
                placeholder="Village, Upazila, detailed address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note to Seller
              </label>

              <textarea
                value={orderData.note}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    note: e.target.value,
                  })
                }
                placeholder="Any special instructions..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>

              <span className="text-2xl font-bold text-green-700">
                ৳{cow.price?.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              disabled={ordering}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:bg-green-400 transition font-semibold"
            >
              {ordering ? "Placing Order..." : "Confirm Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GoruCowDetail;
