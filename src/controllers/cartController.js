const CartModel=require("../controllers/cartController")
const validator=require("../validations/validator")
const UserModel=require("../models/userModel")
const ProductModel=require("../models/productModel")

const addToCart=(req,res)=>{
    try{
        let userId=req.params.userId;
        if(!userId){
            return res.status(400).send({status:false,message:"please provide userId"})
        }

        if(userId && userId.length!=24){
            return res.status(400).send({status:false,message:"please provide userId"})
        }

        const user=await UserModel.findOne({userId:userId})
        
        if(!user){
            return res.status(400).send({status:false,message:"user does not exist"})
        }

        let 

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const removeToCart=(req,res)=>{
    try{

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const getToCart=(req,res)=>{
    try{

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const deleteToCart=(req,res)=>{
    try{

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports={addToCart,removeToCart,getToCart,deleteToCart}