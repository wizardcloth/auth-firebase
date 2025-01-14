// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());

app.use('/api/auth', authRoutes);  // Set up authentication routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();  // Connect to MongoDB
});
