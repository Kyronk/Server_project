const router = require("express").Router();
const controller = require("../controller/customer");

// verify token
const authVerify = require("../middleware/authVerify");

// Route
router.post("/register", controller.register);
router.post("/login", controller.login);


// router.get("/list", [authVerify.verifyToken], controller.getAllCustomer);
module.exports = router;