var express = require("express");
var bcrypt = require("bcryptjs");
// var popups = require("popups");
let alert = require("alert");

var router = express.Router();

const { default: mongoose } = require("mongoose");
var { CustomerInfo } = require("../../models/customer_info");
const { append } = require("express/lib/response");
let { session } = require("passport");

var Book = require("../../models/book_info");

//TODO:: add in error and info

router.post("/register", async function (req, res, next) {
	if (
        !req.body.username ||
		!req.body.email ||
		!req.body.phoneNo||
		!req.body.password ||
		!req.body.passwordConf
	) {
		alert("Fill in all detail required");
	} else {
		CustomerInfo.findOne({ email: req.body.email }).then((customer) => {
			if (customer) {
				alert("Email already registered");
			} else {
				if (req.body.password != req.body.passwordConf) {
					alert("Wrong password input");
				} else {
					const data = new CustomerInfo({
                        name: req.body.username,
						email: req.body.email,
						phoneNo : req.body.phoneNo,
						password: req.body.password,
					});
					data.save()
						.then(() => {
							alert("Registration success");
							res.render("index");
						})
						.catch((err) => console.log(err));
				}
			}
		});
	}
});

router.post("/login", function (req, res, next) {
	CustomerInfo.findOne({
		email: req.body.email
	}, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						// session = req.session.email;
						res.render("userdashboard");
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

router.put("/updprofile", (req, res) =>{

	email =  req.body.email;
	name = req.body.name;
	phoneNo = req.body.phoneNo;
	customer = req.body.userID

	CustomerInfo.findByIdAndUpdate((customer), {'name': name, 'email': email, 'phoneNo': phoneNo}, function(err, result){
		if(err)
		{
			// res.json({status: "fail", message: "Customer failed to update"})
			req.flash("message", "Customer failed to update")
			res.redirect('/customer/editprofile')
		}
		else{
			// res.json({status: "success", message: "Customer has been to updated"})
			req.flash("message", "Customer has been updated!")
			res.redirect('/customer/editprofile')
		}
	})
})

router.post("/userdashboard", function (req, res, next) {
	CustomerInfo.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						console.log(session);
						res.render("userdashboard", {session});
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


router.post("/editprofile", function (req, res, next) {
	const update = {
		name: req.body.name,
		email: req.body.name,
	};
	CustomerInfo.findOneAndUpdate({ email: req.session.email }, update)
		.then(() => {
			CustomerInfo.find({}, function (err, data) {
				if (data) {
					alert("Update success");
					res.render("customer/profile", {
						name: update.name,
						email: update.email,
					});
				}
			});
		})
		.catch((err) => console.log(err));
});


router.post("/book", function (req, res, next) {
	CustomerInfo.findOne({ email: req.body.email }, function (err, data) {
		if(data) {
			customerData = data;
			const book1 = new Book.bookInfo({
				userEmail: req.body.email,
				bookDate: req.body.date,
				bookTime: req.body.time,
				court: req.body.court,
			});

			book1.save((err, result) => {
				if(!err) {
					res.redirect('/customer/book')
				}
				else {
					console.log(err)
					res.json({status: 'Fail'})
				}
			})
		}
		else {
			res.json("Not Found")
		}
	});
});

module.exports = router;
