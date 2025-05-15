const express = require("express");

const app = express(); 

app.use(express.json())


const port = 9000;

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to Rojgari Hub API")
})

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})