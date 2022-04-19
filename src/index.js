//importing packages
const dotenv=require("dotenv").config()
const express =require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const route=require("./routes/route")
const multer=require("multer")

//express initialize
const app=express()
console.log(process.env.SECRETKEY)
//middleware for body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(multer().any())


//connect database 
mongoose.connect("mongodb+srv://Tujli:mst@cluster0.hlfbs.mongodb.net/ProductsManagement?retryWrites=true&w=majority",{
    useNewUrlParser:true
})
.then(()=>console.log("mongodb is connected"))
.catch((err)=>{console.log(err.message)})

//route setup
app.use("/",route)

//port
const port =process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})