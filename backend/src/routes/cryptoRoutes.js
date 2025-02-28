import express from "express";
import {
  getCoinData,
  getCryptoNews,
  getGlobalStats,
  getCoinDetails,
  getCoinHistory
} from "../controllers/cryptoController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes that don't need authentication
router.get("/global-stats", getGlobalStats);

// Protected routes that require authentication
router.get("/coins", protect, getCoinData);
router.get("/news", protect, getCryptoNews);
router.get("/coin/:coinId", protect, getCoinDetails);
router.get("/coin/:coinId/history/:timeperiod?", protect, getCoinHistory);

export default router;

