import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors({
    origin: "https://cryptoverse-bca.vercel.app/",
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.use('/api/auth', authRoutes);
app.use('/api/cryptos', cryptoRoutes);
app.use('/api/admin', adminRoutes)

app.use(errorMiddleware);


export default app;
