var express = require("express");
var bcrypt = require("bcryptjs");
// var popups = require("popups");
let alert = require("alert");
var { AdminInfo } = require("../../models/admin_info");
const { courtInfo } = require("../../models/court");


var router = express.Router();

router.post("/register", async function (req, res, next) {
	if (
        !req.body.username ||
		!req.body.email ||
		!req.body.password ||
		!req.body.passwordConf
	) {
		alert("Fill in all detail required");
	} else {
		AdminInfo.findOne({ email: req.body.email }).then((customer) => {
			if (customer) {
				alert("Email already registered");
			} else {
				if (req.body.password != req.body.passwordConf) {
					alert("Wrong password input");
				} else {
					const data = new AdminInfo({
                        name: req.body.username,
						email: req.body.email,
						password: req.body.password,
					});
					data.save()
						.then(() => {
							alert("Registration success");
							res.render("admin/login");
						})
						.catch((err) => console.log(err));
				}
			}
		});
	}
});

router.post("/login", function (req, res, next) {
	AdminInfo.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						// session = req.session.email;
						res.render("admin/admindashboard");
					} else {
						alert("Wrong password input");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			alert("Email and Password does not matched");
		}
	});
});

router.post("/admindashboard", function (req, res, next) {
	CustomerInfo.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						console.log(session);
						res.render("admindashboard", {session});
					} else {
						alert("Wrong password input");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			alert("Email and Password does not matched");
		}
	});
});



router.post("/adminaddcourt", function (req, res, next) {

});



router.put("/updcourt", (req, res) =>{

		name = req.body.courtName;
		cStatus = req.body.status;
		court = req.body.courtId
	
		courtInfo.findByIdAndUpdate((court), {'name': name, 'status' : cStatus }, function(err, result){
			if(err)
			{
				// res.json({status: "fail", message: "Customer failed to update"})
				req.flash("message", "Court failed to update")
				res.redirect('/admin/admineditcourt/'+court)
			}
			else{
				// res.json({status: "success", message: "Customer has been to updated"})
				req.flash("message", "Court has been updated!")
				res.redirect('/admin/admineditcourt/'+court)
			}
		})
	})

module.exports = router;
