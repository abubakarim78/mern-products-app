import dotenv from "dotenv";
dotenv.config(); // For dotenv dependency configuration

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/database.js";
import productsRouter from "./routes/products.routes.js";
import userRouter from "./routes/user.routes.js";

// Get the express instance to start the app
const app = express();
app.use(express.json()); // To parse JSON data
app.use(cors("*")); // To avoid CORS error
app.use(cookieParser()); // To parse cookies


// Project routes
app.use("/auth", userRouter);
app.use("/products", productsRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Express app is running on port", PORT);
  connectDB();
});
