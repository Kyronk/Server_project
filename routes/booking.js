const router = require("express").Router();
const controller = require("../controller/booking");

// verify token
const authVerify = require("../middleware/authVerify");

//ROUTER POST
router.post("/create", [authVerify.verifyToken], controller.create);
router.get("/history-booking", [authVerify.verifyToken], controller.getHistoryBooking);

module.exports = router;
