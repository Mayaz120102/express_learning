import express from "express";
import {
  goruPlaceOrder,
  goruGetMyOrders,
  goruGetSellerOrders,
  goruUpdateOrderStatus,
  goruCancelOrder,
} from "../controllers/goruOrderController.js";
import {
  goruProtect,
  goruRestrictTo,
} from "../middleware/goruAuthMiddleware.js";

const router = express.Router();

// All order routes require login
router.use(goruProtect);

router.post("/", goruRestrictTo("buyer"), goruPlaceOrder);
router.get("/my-orders", goruGetMyOrders);
router.get(
  "/seller-orders",
  goruRestrictTo("seller", "admin"),
  goruGetSellerOrders,
);
router.patch(
  "/:id/status",
  goruRestrictTo("seller", "admin"),
  goruUpdateOrderStatus,
);
router.patch("/:id/cancel", goruRestrictTo("buyer"), goruCancelOrder);

export default router;
