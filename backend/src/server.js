import express from "express";

// All file folder emport here
import connectDB from "../config/db";
import router from "../route/listingRoute";

const app = express(); 

app.use(express.json())


const port = 9000;


app.get("/",(req,res)=>{
    res.status(200).send("Welcome to Rojgari Hub API")
})
//use
app.use("/List", listingRoute);

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})