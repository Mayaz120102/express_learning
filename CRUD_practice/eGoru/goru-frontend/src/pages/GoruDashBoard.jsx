import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userGoruAuth from "../hooks/userGoruAuth";
import goruAxios from "../api/goruAxios";

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

  // Listings state
  const [cows, setCows] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch seller's own cow listings
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

  // Fetch seller's incoming orders
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
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="py-6">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-6">
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

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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

      {/* ── TABS ── */}
      <div className="flex gap-2 mb-8 border-b">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-6 py-3 font-medium text-sm transition border-b-2 -mb-px ${
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
          className={`px-6 py-3 font-medium text-sm transition border-b-2 -mb-px ${
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
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
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
        <div key={order._id} className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-start justify-between">
            {/* Cow + buyer info */}
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-xl overflow-hidden shrink-0">
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
                <h3 className="font-bold text-gray-800">{order.cow?.title}</h3>
                <p className="text-green-700 font-bold">
                  ৳{order.totalPrice?.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Buyer: {order.buyer?.name} · 📞 {order.buyer?.phone || "N/A"}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  📍 {order.deliveryAddress?.district}
                  {order.deliveryAddress?.details &&
                    ` — ${order.deliveryAddress.details}`}
                </p>
                {order.note && (
                  <p className="text-gray-400 text-xs mt-1">
                    Note: {order.note}
                  </p>
                )}
              </div>
            </div>

            {/* Status + actions */}
            <div className="text-right space-y-2 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <p className="text-gray-400 text-xs">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {order.status === "pending" && (
                <div className="flex gap-2 justify-end mt-2">
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
