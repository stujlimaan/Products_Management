//importing package and controllers
const express=require("express")
const router=express.Router();
const UserController=require("../controllers/userController")
const ProductController=require("../controllers/productsController")
const CartController=require("../controllers/cartController")
<<<<<<< HEAD
const OrderController=require("../controllers/orderController")
=======
>>>>>>> 94e82bf684f353952bd324c67674591950bb58ac
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

//api for cart
<<<<<<< HEAD
router.post('/users/:userId/cart', mid.authentication, mid.authorization, CartController.createCart )
router.put('/users/:userId/cart', mid.authentication, mid.authorization, CartController.updateCart )
router.get('/users/:userId/cart', mid.authentication, mid.authorization, CartController.getCartDetails )
router.delete('/users/:userId/cart', mid.authentication, mid.authorization, CartController.emptyCart )

//api for order
router.post("/users/:userId/orders",mid.authentication,mid.authorization,OrderController.createOrder)
router.put("/users/:userId/orders",mid.authentication,mid.authorization,OrderController.updateStatus)
=======
router.post("/users/:userId/cart",CartController.addToCart)
router.put("/users/:userId/cart",CartController.removeToCart)
router.get("/users/:userId/cart",CartController.getToCart)
router.delete("/users/:userId/cart",CartController.deleteToCart)


>>>>>>> 94e82bf684f353952bd324c67674591950bb58ac


module.exports =router