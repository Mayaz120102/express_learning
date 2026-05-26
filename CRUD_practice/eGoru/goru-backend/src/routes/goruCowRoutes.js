import express from "express";
import {
  goruCreateCow,
  goruGetAllCows,
  goruGetSingleCow,
  goruUpdateCow,
  goruDeleteCow,
  goruGetMyCows,
} from "../controllers/goruCowController.js";
import {
  goruProtect,
  goruRestrictTo,
} from "../middleware/goruAuthMiddleware.js";

const router = express.Router();

// Public — anyone can browse
router.get("/", goruGetAllCows);
// Private — must be logged in
router.get("/seller/my-cows", goruProtect, goruGetMyCows);
router.get("/:id", goruGetSingleCow);

// Private — sellers only
router.post("/", goruProtect, goruRestrictTo("seller", "admin"), goruCreateCow);
router.put(
  "/:id",
  goruProtect,
  goruRestrictTo("seller", "admin"),
  goruUpdateCow,
);
router.delete(
  "/:id",
  goruProtect,
  goruRestrictTo("seller", "admin"),
  goruDeleteCow,
);

export default router;
