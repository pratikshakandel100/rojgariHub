import express from "express";
import dotenv from 'dotenv';
// All file folder emport here
import connectDB from "../config/db.js";
import listingRoute from "../routes/listingRoute.js";

const app = express(); 
dotenv.config();
app.use(express.json())
connectDB();

const port = 9000;


app.get("/",(req,res)=>{
    res.status(200).send("Welcome to Rojgari Hub API")
})
//use
app.use("/listing", listingRoute);

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})