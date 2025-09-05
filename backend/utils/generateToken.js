import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const generateToken = async (userId, res) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    const time = new Date();
    const payload = { id: userId, date: time };

    const token = jwt.sign(payload, JWT_SECRET_KEY, { 
        expiresIn: '7d' 
    });
   
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return token;
};