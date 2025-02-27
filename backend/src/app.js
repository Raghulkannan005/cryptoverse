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

// Middleware to handle CORS headers manually
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://cryptoverse-bca.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Still keep the cors middleware as backup
app.use(cors({
    origin: ["https://cryptoverse-bca.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle OPTIONS on all routes
app.options('*', (req, res) => {
  res.status(200).end();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptos', cryptoRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
