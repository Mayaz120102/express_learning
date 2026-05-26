// goruAuthRoutes.js
import express from "express";
import {
  goruRegister,
  goruLogin,
  goruGetMe,
} from "../controllers/goruAuthController.js";
import { goruProtect } from "../middleware/goruAuthMiddleware.js";

const router = express.Router();

router.post("/register", goruRegister);
router.post("/login", goruLogin);
router.get("/me", goruProtect, goruGetMe); // protected — needs valid token

export default router;
