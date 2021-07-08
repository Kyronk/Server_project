const router = require("express").Router();
const admin = require("../controller/admin");

const authVerify = require("../middleware/authVerify");

router.post("/register", admin.register);
router.get("/list", [authVerify.verifyToken, authVerify.isAdmin], admin.getAllCustomer);
router.post("/create", [authVerify.verifyToken, authVerify.isAdmin], admin.createCustomer);
router.put("/update/:id", [authVerify.verifyToken, authVerify.isAdmin], admin.updateCustomer);
router.delete("/delete/:id", [authVerify.verifyToken, authVerify.isAdmin], admin.deleteCustomer);

module.exports = router;
