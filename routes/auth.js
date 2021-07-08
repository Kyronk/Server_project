const router = require("express").Router();

const controller = require("../controller/auth");

//admin login
router.post("/admin-login", controller.adminLogin);

//customer login
router.post("/customer-login", controller.customerLogin);

module.exports = router;
