import dotenv from "dotenv";
dotenv.config(); // For dotenv dependency configuration
import mongoose from "mongoose";

// Database connection function
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};