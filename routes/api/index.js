var express = require("express");
var passport = require("passport");
var router = express.Router();

router.use("/customer", require("./customer"));
// router.use("/guest", require("./guest"));
// router.use("/staff", require("./staff"));
router.use("/admin", require("./admin"));

module.exports = router;
