import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userGoruAuth from "../hooks/userGoruAuth";
import goruAxios from "../api/goruAxios";
import toast from "react-hot-toast";

// ─── STATUS STYLES ────────────────────────────────────────────────
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
const GoruDashboard = () => {
  const { goruUser } = userGoruAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("listings");

  const [cows, setCows] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const fetchMyCows = async () => {
      try {
        const { data } = await goruAxios.get("/cows/seller/my-cows");
        setCows(data.cows);
      } catch (err) {
        console.error(err);
      } finally {
        setListingsLoading(false);
      }
    };
    fetchMyCows();
  }, []);

  const fetchSellerOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await goruAxios.get("/orders/seller-orders");
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await goruAxios.delete(`/cows/${id}`);
      setCows(cows.filter((c) => c._id !== id));
      toast.success("Listing deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="py-4 md:py-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-700">
            My Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Welcome back, {goruUser?.name}
          </p>
        </div>
        <Link
          to="/cows/add"
          className="bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition font-semibold text-sm md:text-base text-center"
        >
          + List New Cow
        </Link>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-3 md:p-5 text-center">
          <p className="text-2xl md:text-3xl font-bold text-green-700">
            {cows.length}
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Total</p>
        </div>
        <div className="bg-white rounded-xl shadow p-3 md:p-5 text-center">
          <p className="text-2xl md:text-3xl font-bold text-green-700">
            {cows.filter((c) => c.isAvailable).length}
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Available</p>
        </div>
        <div className="bg-white rounded-xl shadow p-3 md:p-5 text-center">
          <p className="text-2xl md:text-3xl font-bold text-green-700">
            {cows.filter((c) => !c.isAvailable).length}
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Sold</p>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 md:px-6 py-3 font-medium text-sm whitespace-nowrap transition border-b-2 -mb-px ${
            activeTab === "listings"
              ? "border-green-700 text-green-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Listings
        </button>
        <button
          onClick={() => {
            setActiveTab("orders");
            fetchSellerOrders();
          }}
          className={`px-4 md:px-6 py-3 font-medium text-sm whitespace-nowrap transition border-b-2 -mb-px ${
            activeTab === "orders"
              ? "border-green-700 text-green-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Incoming Orders
        </button>
      </div>

      {/* ── LISTINGS TAB ── */}
      {activeTab === "listings" && (
        <>
          {listingsLoading ? (
            <div className="text-center py-10 text-green-700 animate-pulse">
              Loading...
            </div>
          ) : cows.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow px-4">
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
            <>
              {/* Desktop table — hidden on mobile */}
              <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
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
                          <div className="flex gap-3">
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

              {/* Mobile cards — shown only on mobile */}
              <div className="md:hidden space-y-3">
                {cows.map((cow) => (
                  <div key={cow._id} className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-3 items-center">
                        {/* Cow image or emoji */}
                        <div className="w-14 h-14 bg-green-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                          {cow.images?.[0] ? (
                            <img
                              src={cow.images[0]}
                              alt={cow.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🐄</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {cow.title}
                          </p>
                          <p className="text-gray-500 text-xs">{cow.breed}</p>
                          <p className="text-green-700 font-bold text-sm mt-0.5">
                            ৳{cow.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${
                          cow.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cow.isAvailable ? "Available" : "Sold"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-3 border-t">
                      <button
                        onClick={() => navigate(`/cows/${cow._id}/edit`)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cow._id)}
                        className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/cows/${cow._id}`)}
                        className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-xs font-medium hover:bg-gray-100 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === "orders" && (
        <GoruSellerOrders
          orders={orders}
          loading={ordersLoading}
          onStatusUpdate={(id, status) => {
            setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
          }}
        />
      )}
    </div>
  );
};

// ─── SELLER ORDERS COMPONENT ──────────────────────────────────────
const GoruSellerOrders = ({ orders, loading, onStatusUpdate }) => {
  const handleStatus = async (orderId, status) => {
    try {
      await goruAxios.patch(`/orders/${orderId}/status`, { status });
      onStatusUpdate(orderId, status);
      toast.success(`Order ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-green-700 animate-pulse">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500">No orders received yet</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-2xl shadow-md p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            {/* Cow + buyer info */}
            <div className="flex gap-3 md:gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 rounded-xl overflow-hidden shrink-0">
                {order.cow?.images?.[0] ? (
                  <img
                    src={order.cow.images[0]}
                    alt={order.cow.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🐄
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">
                  {order.cow?.title}
                </h3>
                <p className="text-green-700 font-bold text-sm md:text-base">
                  ৳{order.totalPrice?.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  Buyer: {order.buyer?.name}
                  {order.buyer?.phone && ` · 📞 ${order.buyer.phone}`}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  📍 {order.deliveryAddress?.district}
                  {order.deliveryAddress?.details &&
                    ` — ${order.deliveryAddress.details}`}
                </p>
                {order.note && (
                  <p className="text-gray-400 text-xs mt-1">📝 {order.note}</p>
                )}
              </div>
            </div>

            {/* Status + actions */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {order.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(order._id, "confirmed")}
                    className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-800 transition font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatus(order._id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoruDashboard;
