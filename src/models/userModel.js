const mongoose = require("mongoose");
const validator=require("validator")

const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required:true,
        trim:true
    },
    lname: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        validate:{
            validator:validator.isEmail,
            message:`{VALUE} is not valid email`,
            isAsync:false
        },
        lowercase:true,
        unique:true,
        trim:true
    },
    profileImage: {
        type:String,
        required:true
    }, // s3 link
    phone: {
       type: String,
        required:true,
        unique:true,
        trim:true,
        validate: {
            validator: function (v) {
              return /\d{10}/.test(v);
            },
            message: (props) => `${props.value} is not valid phone number`,
          }
    },
    password: {
       type: String,
        required:true,
    
        // minLen 8,
        // maxLen 15
    }, // encrypted password
    address: {
        shipping: {
            street: {
                type: String,
                required:true
            },
            city: {
               type: String,
                required:true
            },
            pincode: {
              type:Number,
                required:true
            }
        },
        billing: {
            street: {
               type:String,
                required:true
            },
            city: {
                type:String,
                required:true
            },
            pincode: {
                type:Number,
                required:true
            }
        }
    },
    createdAt: {
        type:Date,default:null
    },
    updatedAt: {
        type:Date,default:null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)