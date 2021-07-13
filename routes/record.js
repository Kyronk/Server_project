const router = require("express").Router();

const controller = require("../controller/record");

const authVerify = require("../middleware/authVerify");

//admin create record
router.post("/create", [authVerify.verifyToken, authVerify.isAdmin], controller.createRecord);

//get record by customer
router.get("/all-record", [authVerify.verifyToken], controller.getRecordByCustomer);

module.exports = router;
