var express = require("express");
var passport = require("passport");
var router = express.Router();

router.get("/", function(req,res){
    res.render("index")
})

router.get("/login", function(req,res){
    res.render("login")
})

router.get("/register", function(req,res){
    res.render("register")
})

router.get("/userprofile", function(req, res){
    res.render("userprofile");
})

router.get("/guestbooking", function(req,res){
    res.render("guestbooking")
})


router.get("/logout", function (req, res, next) {
	console.log("logout");
	if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect("/");
			}
		});
	}
});

router.use("/customer", require("./customer"));
router.use("/admin", require("./admin"));
// router.use("/staff", require("./staff"));

module.exports = router;
