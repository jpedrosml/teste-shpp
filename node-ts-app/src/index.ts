import express from "express";
import mongoose from "mongoose";
import measureRoutes from "./routes/measureRoutes";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));  

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
mongoose.connect(MONGO_URL, {
    dbName: "node-typescript-app",
})
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => console.log("Database connection error:", error));

app.use('/api', measureRoutes);  

app.listen(4000, () => {
    console.log('Server running on port http://localhost:4000');
});

console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY}`);
