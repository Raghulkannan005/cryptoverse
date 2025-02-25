import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.get("/", (req, res) => {
    res.send("Hello World!");
});


export default app;

