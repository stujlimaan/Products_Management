//importing package and controllers
const express=require("express")
const router=express.Router();
const UserController=require("../controllers/userController")
const ProductController=require("../controllers/productsController")
const mid=require("../middlewares/auth")


//Api for users
router.post("/register",UserController.register)
router.post("/login",UserController.login)
router.get("/user/:userId/profile",mid.authentication, UserController.getProfile)
router.put("/user/:userId/profile",mid.authentication,UserController.updateProfile)

//api for products'
router.post("/products",ProductController.createProducts)
router.get("/products",ProductController.getProducts)
router.get("/products/:productId",ProductController.getProductsById)
router.put("/products/:productId",ProductController.updateProducts)
router.delete("/products/:productId",ProductController.deleteProducts)



module.exports =router