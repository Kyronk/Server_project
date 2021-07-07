const router = require("express").Router();
const admin = require("../controller/admin");

const authVerify = require("../middleware/authVerify");


router.post("/login", admin.login);
router.post("/register", admin.register);
router.get("/list", [authVerify.verifyToken], admin.getAllCustomer);
router.post("/create", [authVerify.verifyToken], admin.createCustomer);
router.put("/update/:id",[authVerify.verifyToken] , admin.updateCustomer);
router.delete("/delete/:id", [authVerify.verifyToken], admin.deleteCustomer);

module.exports = router;
