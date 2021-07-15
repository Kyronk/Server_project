const router = require("express").Router();
const controller = require("../controller/customer");

// verify token
const authVerify = require("../middleware/authVerify");

// Route
router.post("/register", controller.register);
router.post("/update-profile", [authVerify.verifyToken], controller.updateProfile);
router.post("/change-password", [authVerify.verifyToken], controller.changePassword);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", [authVerify.verifyToken], controller.verifyOTP);

// router.get("/list", [authVerify.verifyToken], controller.getAllCustomer);
module.exports = router;
