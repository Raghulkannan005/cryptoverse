import express from "express";
import {
  register,
  login,
  verifyToken
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-token", protect, verifyToken);


export default router;