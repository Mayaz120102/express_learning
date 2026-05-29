import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import goruAxios from "../api/goruAxios";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
};

const GoruMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await goruAxios.get("/orders/my-orders");
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await goruAxios.patch(`/orders/${orderId}/cancel`);

      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );

      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-green-700 animate-pulse">
        Loading orders...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between">
                {/* Cow info */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-green-50 rounded-xl overflow-hidden shrink-0">
                    {order.cow?.images?.[0] ? (
                      <img
                        src={order.cow.images[0]}
                        alt={order.cow.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🐄
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      {order.cow?.title}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {order.cow?.breed} · {order.cow?.district}
                    </p>

                    <p className="text-green-700 font-bold mt-1">
                      ৳{order.totalPrice?.toLocaleString()}
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      Seller: {order.seller?.name}
                    </p>
                  </div>
                </div>

                {/* Status + action */}
                <div className="text-right space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_STYLES[order.status]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>

                  <p className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="block text-red-500 text-xs hover:underline"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery info */}
              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <span>📍 {order.deliveryAddress?.district}</span>

                {order.deliveryAddress?.details && (
                  <span className="ml-4">
                    — {order.deliveryAddress.details}
                  </span>
                )}

                {order.note && (
                  <p className="mt-1 text-gray-400">Note: {order.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoruMyOrders;
