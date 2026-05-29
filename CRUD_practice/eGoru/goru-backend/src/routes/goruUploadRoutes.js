import express from "express";
import { goruUploadImages } from "../controllers/goruUploadController.js";
import { goruProtect } from "../middleware/goruAuthMiddleware.js";
import goruUpload from "../config/goruCloudinary.js";

const router = express.Router();

// goruProtect    → must be logged in
// goruUpload.array('images', 5) → multer processes up to 5 images
//   'images' must match the field name in the frontend FormData
// goruUploadImages → our controller sends back the URLs
router.post("/", goruProtect, goruUpload.array("images", 5), goruUploadImages);

export default router;
