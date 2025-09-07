import express from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/user.controllers.js";
import { authenticate, authorize } from "../middleware/authenticate.js";

const userRouter = express.Router()

userRouter.post("/", registerUser);
userRouter.post("/login", authenticate, authorize('admin'), loginUser);
userRouter.get("/:id", authenticate, getUserProfile);
userRouter.put("/:id", authenticate, updateUserProfile)

export default userRouter;