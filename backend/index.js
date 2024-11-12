import express from 'express';
import dotenv from 'dotenv';
import UserRoutes from "./Routes/user.js";
import productRoutes from "./Routes/product.js";
import connectDb from './database/db.js';
dotenv.config();

const app=express();
app.use(express.json());

const port=process.env.PORT;

app.use("/api",UserRoutes);

app.use("/api",productRoutes);

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})