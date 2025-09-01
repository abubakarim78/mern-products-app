import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    const {name, email, password, phone} = req.body;

    try {

    // Validate inputs

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    // Check if user already exist in the system

    const existingUser = await userModel.findOne({email});

    if (existingUser){
        return res.status(400).json({
            success: false,
            message: "User alreadt exist"
        })
    }
    // Hashing the password first
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Create the new user

    const newUser = userModel({
        name,
        email,
        password: hashPassword,
        phone
    })

    await newUser.save();

    return res.status(200).json({
        success: true,
        message: "New User Created Successfully",
        user: newUser
    })

    } catch (error) {
        console.log("Internal Sever error", error);

        return res.status(500).json({
            success: true,
            message: "Internal server error"
        })
    }

};