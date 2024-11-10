import mongoose, { Schema } from "mongoose";

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user",
    },
},{timestamp:true})

export const User=mongoose.model('User',schema)