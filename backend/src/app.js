import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

// Load env variables first
dotenv.config();

const app = express();

// Fixed CORS configuration
app.use(cors({
    origin: ["https://cryptoverse-bca.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptos', cryptoRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
