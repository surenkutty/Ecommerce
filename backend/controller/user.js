import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !contact) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User Email Already Exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(Math.random() * 1000000);

        user = { name,email,password: hashPassword, contact };
        const activationToken = jwt.sign(
            { user, otp },
            process.env.ACTIVATION_SECRET,
            { expiresIn: "5m" }
        );

        const OtpMessage = `Please verify your account using OTP. Your OTP is ${otp}`;
        await sendMail(email, "Welcome to Ecommerce website", OtpMessage);

        return res.status(200).json({
            message: "OTP sent to your mail",
            activationToken,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const verifyUser = async (req, res) => {
    try {
        const { otp, activationToken } = req.body;
        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

        if (!verify) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if (verify.otp !== otp) {
            return res.status(400).json({ message: "Wrong OTP" });
        }

        // Ensure the user details are complete before saving
        const { name, email, password, contact } = verify.user;
        if (!email || !name || !password || !contact) {
            return res.status(400).json({ message: "User details are incomplete" });
        }

        // Check if user already exists (as a safety measure)
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user with verified data
        await User.create({ name, email, password, contact });

        return res.status(200).json({ message: "User Registration Success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid user credentials" });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid password credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });


        const { password: userPassword, ...userDetails } = user.toObject();
        return res.status(200).json({
            message: `Welcome ${user.name}`,
            token,
            user: userDetails,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const myProfile = async (req, res) => {
    try {
        // Ensure req.user exists
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Retrieve user by ID and exclude password
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve profile",
            error: error.message,
        });
    }
};

