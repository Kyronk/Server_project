const router = require("express").Router();
const area = require("../controller/area");

const authVerify = require("../middleware/authVerify");

router.post("/create", [authVerify.verifyToken, authVerify.isAdmin], area.createArea);

module.exports = router;
