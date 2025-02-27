import express from "express";
import {
  getCoinData,
  getCryptoNews,
  getGlobalStats,
  addToWatchList,
  getWatchList,
  removeFromWatchList,
  getCoinDetails
} from "../controllers/cryptoController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes that don't need authentication
router.get("/global-stats", getGlobalStats);

// Protected routes that require authentication
router.get("/coins", protect, getCoinData);
router.get("/news", protect, getCryptoNews);
router.get("/coin/:coinId", protect, getCoinDetails);

router.post("/watchlist", protect, addToWatchList);
router.get("/watchlist", protect, getWatchList);
router.delete("/watchlist", protect, removeFromWatchList);

export default router;

