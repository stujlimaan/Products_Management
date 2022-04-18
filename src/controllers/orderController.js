const OrderModel = require('../models/orderModel')
const CartModel = require('../models/cartModel')
const Validator = require('../validations/validator')

//*******************************************CREATE ORDER*************************************************** */

const createOrder = async function(req, res){
    try{
        const requestBody = req.body
        const queryParams = req.query 
        const userIdFromParams = req.params.userId

        // query params must be empty
    if (validator.isRequestBody(queryParams)) {
        return res
          .status(404)
          .send({ status: false, message: " page not found" });
    }


      if(!validator.isRequestBody(requestBody)){
          return res.status(400).send({status : false, message : "Cart data is required "})
      }

      const {userId, items, totalPrice, totalItems} = requestBody

      if(!validator.isValid(userId)){
        return res.status(400).send({status : false, message : "Cart data is required "})
      }

    

    }catch(error){
        res.status(500).send({error : error.message})
    }
}

//=================update status===============
const updateStatus = async function(req, res){
    try{
        const requestBody = req.body
        const queryParams = req.query 
        const userIdFromParams = req.params.userId

        // query params must be empty
    if (validator.isRequestBody(queryParams)) {
        return res
          .status(404)
          .send({ status: false, message: " page not found" });
    }


      if(!validator.isRequestBody(requestBody)){
          return res.status(400).send({status : false, message : "Cart data is required "})
      }

      const {userId, items, totalPrice, totalItems} = requestBody

      if(!validator.isValid(userId)){
        return res.status(400).send({status : false, message : "Cart data is required "})
      }

    

    }catch(error){
        res.status(500).send({error : error.message})
    }
}



module.exports = { createOrder,updateStatus}