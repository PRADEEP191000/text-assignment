const express = require("express")
const router = express.Router();
const userController = require("../controllers/userController.js")
const productController = require("../controllers/productController.js")
const cartController = require("../controllers/cartController.js")
const { authentication, authorization } = require('../middlewares/auth.js');

//-------------------------------USER API---------------------------------//

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

//-------------------------------PRODUCT API---------------------------------//

router.post("/products", productController.createProduct)
router.get("/products", productController.getProduct)
router.put('/products/:productId', productController.updateProduct);


//-------------------------------CART API---------------------------------//

router.post("/users/:userId/cart", authentication, authorization, cartController.createCart)
router.put("/users/:userId/cart", authentication, authorization, cartController.updateCart)
router.get("/users/:userId/cart", authentication, authorization, cartController.getCart)



router.all("/*/", async function (req, res){

    res.status(404).send({status:false, msg: "Wrong url"})
})





module.exports = router;