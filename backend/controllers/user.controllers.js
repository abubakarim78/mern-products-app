import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


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
            message: "User already exist"
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {

    // Destructure email and password from request body
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user and include password for comparison
    const user = await userModel.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }
    
    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = await generateToken(user._id, res);
    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token'
      });
    }

    // Remove password from response
    user.password = undefined;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in user'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await userModel.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        phone,
        address
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};