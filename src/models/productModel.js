const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {
       type:String,
        required:[true,"title is required"],
        unique:true
    },
    description: {
        type:String,
        required:[true,"description is required"],
        
    },
    price: {
       type:Number,
       required:[true,"price is required"],
        // valid number / decimal
    },
    currencyId: {
       type:String,
       required:[true,"currencyId is required"],

        // INR
    },
    currencyFormat: {
       type:String,
        required:[true,"currencyId is required"],
        // Rupee:symbol
    },
    isFreeShipping: {
       type: Boolean,
        default: false
    },
    productImage: {
       type: String,
        required:[true,"currencyId is required"],

    }, // s3 link
    style: {
        type:String
    },
    availableSizes: {

        type:[String],
        required:true,
        trim:true,
        enum:["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    installments: {
       type: Number
    },
    deletedAt: {
       type: Date,
        default:null
        // when the document is deleted
    },
    isDeleted: {
       type: Boolean,
        default: false
    }
},{timestamps:true}) 

module.exports=mongoose.model("Product",productSchema)