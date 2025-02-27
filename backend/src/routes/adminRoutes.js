import express from "express";
import  protect  from "../middlewares/authMiddleware.js";
import { getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, getAllUsers);

export default router;

