import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        // Retrieve token from the Authorization header
        const token = req.headers.token;
       

       

        // Verify the token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData._id);

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(403).json({
            message: "Authentication failed. Please log in again.",
            error: error.message,
        });
    }
};
