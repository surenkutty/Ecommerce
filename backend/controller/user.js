import bcrypt from "bcrypt";
import {User} from "../models/User.js";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

export const registerUser=async(req,res)=>{
    try {
        const {name,email,password,contect}=req.body;
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User Email Already Exists",
            });
        }

        //code convert pass raw to hashed
        const hashPassword=await bcrypt.hash(password,10)

        const otp=Math.floor(Math.random()*1000000);
        user={name,password,hashPassword,contect};
        const activationToken=jwt.sign({id:user._id,user,otp},process.env.ACTIVATION_SECRET,{
            expiresIn:"5m"
        })
       //send Email
       const OtpMessage=`please Verify your account using otp your otp is ${otp}`;
       await sendMail(email,"welcome to Ecommerce website",OtpMessage);
       return res.status(200).json({
        message:"otp sent to your mail",
        activationToken,
       }
        
       )
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const verifyUser=async(req,res)=>{
    try {
        const{otp,activationToken}=req.body;
        const verify=jwt.verify(activationToken,process.env.ACTIVATION_SECRET);
        if(!verify){
            return res.json({
                message:"otp expired",
            })
        }
        if(verify.otp!=otp){
            return res.json({
                message:"Wrong otp",
            })
        };
        await User.create({
            name:verify.user.name,
            email:verify.user.name,
            password:verify.user.hashPassword,
            contact:verify.user.contact,

        })
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}