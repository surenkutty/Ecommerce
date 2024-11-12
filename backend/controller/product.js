import { Product } from "../models/products.js";

export const createProduct=async(req,res)=>{
    try {
        if(req.user.role!="admin"){
            return res.status(403).json({
                message:"UnAuthorized Access"
            })
        }
        const {title,description,category,price,mrp,stock}=req.body;
        const image =req.file;
        if(!image){
            return res.status(400).json({
                message:"please Select the image"
            });
        }
        const product=await Product.create({
            title,
            description,
            category,
            price,
            mrp,
            stock,
            image:image?.path
    });
        res.status(200).json({
            message:"Product Details Added Success",

            product,
         })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
}