import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        // Retrieve token from the custom 'token' header
        const token = req.headers.token;

        // Check if the token is provided
        if (!token) {
            return res.status(404).json({ message: "please login to access" });
        }

       
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded User ID:", decodedData._id);
        req.user = await User.findById(decodedData._id);

        // Check if the user exists in the database
        

        next();
    } catch (error) {
        return res.status(403).json({
            message: "Authentication failed. Please log in again.",
            error: error.message,
        });
    }
};
