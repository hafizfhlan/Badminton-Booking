var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
let { session } = require("passport");
const { CustomerInfo } = require("../../models/customer_info");
const court = require("../../models/court")
var router = express.Router();

router.get("/", function(req, res){
    res.render("userdashboard");
})

router.get("/dashboard", function(req, res){
    res.render("userdashboard");
})


router.get("/userprofile", function (req, res, next) {
	CustomerInfo.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			res.render("userprofile", {
				name: data.name,
				email: data.email,
			});
		} else {
			res.render("userdashboard");
		}
	});
});

router.get("/editprofile", function(req, res){
	CustomerInfo.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			res.render("editprofile", {
				name: data.name, 
				email: data.email, 
				userID: data.id
			});
		} else {
			res.render("userdashboard");
		}
})
})

router.get("/book", function(req, res){
	court.courtInfo.find({}, (err, data) => {
		res.render("bookingcourt", {email: req.session.email, data: data});

	})
    
})

router.get("/history", function(req, res){
	res.render("history");
})

module.exports = router;