import express from 'express';
import dotenv from 'dotenv';
import UserRoutes from "./Routes/user.js";
import connectDb from './database/db.js';
dotenv.config();

const app=express();
app.use(express.json());

const port=process.env.PORT;

app.use("/api",UserRoutes);

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})