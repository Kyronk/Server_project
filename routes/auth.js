const router = require("express").Router();

const controller = require("../controller/auth");

// verify token
const authVerify = require("../middleware/authVerify");

//admin login
router.post("/admin-login", controller.adminLogin);

//customer login
router.post("/customer-login", controller.customerLogin);

router.post("/customer-logout", [authVerify.verifyToken], controller.customerLogout);

module.exports = router;
