const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: objectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [{
        productId: {
<<<<<<< HEAD
            type:objectId,
=======
            typr:objectId,
>>>>>>> 94e82bf684f353952bd324c67674591950bb58ac
            ref:"Product",
            required:true
        },
        quantity: {
            type:Number,
            required:true,
             minlength :1
        }
    }],
    totalPrice: {
        type:Number,
        required:true,
        // comment: "Holds total price of all the items in the cart"
    },
    totalItems: {
        type:Number,
        required:true,
        // comment: "Holds total number of items in the cart"
<<<<<<< HEAD
    }
   
=======
    },
    createdAt: {
        type:Date,
        default:null

    },  
    updatedAt: {
        type:Date,
        default:null
    },
>>>>>>> 94e82bf684f353952bd324c67674591950bb58ac
}, {
    timestamps: true
})

module.exports = mongoose.model("Cart", cartSchema)