import dotenv from "dotenv";
dotenv.config(); // For dotenv dependency configuration

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/database.js";
import productsRouter from "./routes/products.routes.js";
import userRouter from "./routes/user.routes.js";
import rateLimit from "express-rate-limit";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";
import securityMiddleware from "./middleware/security.js";
import validationRouter from "./routes/validation.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

// Get the express instance to start the app
const app = express();
app.use(express.json()); // To parse JSON data
app.use(cors("*")); // To avoid CORS error
app.use(cookieParser()); // To parse cookies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(securityMiddleware); // Apply security middleware


// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
});

// Project routes
app.use("/auth", authLimiter, userRouter);
app.use("/products", authLimiter, productsRouter);
app.use("/categories", authLimiter, categoryRouter); // New categories route
app.use("/orders", authLimiter, orderRouter); // New orders route
app.use("/validation", authLimiter, validationRouter); // New validation route
app.use("/analytics", authLimiter, analyticsRouter); // New analytics route

  // Health check endpoint
  app.get('/', (req, res) => {
  res.json({ 
    message: 'Ecommerce API is running!', 
    version: '1.0.0',
    endpoints: {
      products: '/products',
      users: '/auth'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Express app is running on port", PORT);
  connectDB();
});
