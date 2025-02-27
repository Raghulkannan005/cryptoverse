import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

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

// Security headers with helmet
app.use(helmet());

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
});

// Stricter rate limit for authentication endpoints - 5 attempts per minute
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  standardHeaders: true,
  message: {
    status: 429,
    message: 'Too many login attempts, please try again later.'
  }
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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
