import GoruOrder from "../models/GoruOrder.js";
import GoruCow from "../models/GoruCow.js";

// ─── PLACE ORDER (buyer) ──────────────────────────────────────────
export const goruPlaceOrder = async (req, res) => {
  try {
    const { cowId, deliveryAddress, note } = req.body;

    // Find the cow
    const cow = await GoruCow.findById(cowId);
    if (!cow) {
      return res.status(404).json({
        success: false,
        message: "Cow not found",
      });
    }

    // Can't buy your own cow
    if (cow.seller.toString() === req.goruUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot order your own listing",
      });
    }

    // Can't order an already sold cow
    if (!cow.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This cow is no longer available",
      });
    }

    // Check if buyer already has a pending order for this cow
    const existingOrder = await GoruOrder.findOne({
      cow: cowId,
      buyer: req.goruUser._id,
      status: "pending",
    });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending order for this cow",
      });
    }

    const order = await GoruOrder.create({
      cow: cowId,
      buyer: req.goruUser._id,
      seller: cow.seller,
      totalPrice: cow.price,
      deliveryAddress,
      note,
    });

    // Populate for response
    await order.populate([
      { path: "cow", select: "title breed price images" },
      { path: "buyer", select: "name phone" },
    ]);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET BUYER'S ORDERS ───────────────────────────────────────────
export const goruGetMyOrders = async (req, res) => {
  try {
    const orders = await GoruOrder.find({ buyer: req.goruUser._id })
      .populate("cow", "title breed price images district")
      .populate("seller", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SELLER'S INCOMING ORDERS ────────────────────────────────
export const goruGetSellerOrders = async (req, res) => {
  try {
    const orders = await GoruOrder.find({ seller: req.goruUser._id })
      .populate("cow", "title breed price images")
      .populate("buyer", "name phone district")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE ORDER STATUS (seller) ────────────────────────────────
export const goruUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await GoruOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the seller of this order can update it
    if (order.seller.toString() !== req.goruUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    order.status = status;
    await order.save();

    // If confirmed — mark cow as sold
    if (status === "confirmed") {
      await GoruCow.findByIdAndUpdate(order.cow, { isAvailable: false });
    }

    // If rejected — make cow available again
    if (status === "rejected") {
      await GoruCow.findByIdAndUpdate(order.cow, { isAvailable: true });
    }

    res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CANCEL ORDER (buyer) ─────────────────────────────────────────
export const goruCancelOrder = async (req, res) => {
  try {
    const order = await GoruOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the buyer can cancel their own order
    if (order.buyer.toString() !== req.goruUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${order.status} order`,
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
