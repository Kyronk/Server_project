const router = require("express").Router();

const controller = require("../controller/record");

const authVerify = require("../middleware/authVerify");

//admin create record
router.post("/create", [authVerify.verifyToken, authVerify.isAdmin], controller.createRecord);

//get record by customer
router.get("/all-record", [authVerify.verifyToken], controller.getRecordByCustomer);

//get record by customer Id
router.get("/customer-record/:id", [authVerify.verifyToken, authVerify.isAdmin], controller.getRecordByCustomerId);

module.exports = router;
