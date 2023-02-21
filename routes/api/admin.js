var express = require("express");
var bcrypt = require("bcryptjs");
// var popups = require("popups");
let alert = require("alert");
var {
	AdminInfo
} = require("../../models/admin_info");
const {
	courtInfo
} = require("../../models/court");
const {
	CustomerInfo
} = require("../../models/customer_info");
const {
	bookInfo
} = require("../../models/book_info");
const {
	default: mongoose
} = require("mongoose");



var router = express.Router();

/* This is a route handler. It is a function that is called when a request is made to the route. */
router.post("/register", async function (req, res, next) {
	if (
		!req.body.username ||
		!req.body.email ||
		!req.body.password ||
		!req.body.passwordConf
	) {
		alert("Fill in all detail required");
	} else {
		AdminInfo.findOne({
			email: req.body.email
		}).then((customer) => {
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
							req.flash("message", "Registration Success!")
							res.render("admin/login");
						})
						.catch((err) => console.log(err));
				}
			}
		});
	}
});

/* This is a route handler. It is a function that is called when a request is made to the route. */
router.post("/login", function (req, res, next) {
	AdminInfo.findOne({
		email: req.body.email
	}, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						// session = req.session.email;
						res.redirect("/admin/admindashboard");
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

/* A route handler. It is a function that is called when a request is made to the route. */
router.post("/admindashboard", function (req, res, next) {
	CustomerInfo.findOne({
		email: req.body.email
	}, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						// console.log(session);
						res.render("admindashboard", {
							session
						});
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




/* This is a route handler. It is a function that is called when a request is made to the route. */
router.post("/adminaddcourt", function (req, res, next) {

	const data = new courtInfo({
		name: req.body.name,
	});
	data.save()
		.then(() => {
			req.flash("message", "Court has been added successfully!")
			res.redirect("/admin/adminaddcourt");
		})
		.catch((err) => console.log(err));
});



/* A route handler. It is a function that is called when a request is made to the route. */
router.put("/updcourt", (req, res) => {

	name = req.body.courtName;
	cStatus = req.body.status;
	court = req.body.courtId

	courtInfo.findByIdAndUpdate((court), {
		'name': name,
		'status': cStatus
	}, function (err, result) {
		if (err) {
			// res.json({status: "fail", message: "Court failed to update"})
			req.flash("message", "Court failed to update")
			res.redirect('/admin/admincourtmanage/' + court)
		} else {
			// res.json({status: "success", message: "Court has been to updated"})
			req.flash("message", "Court has been updated!")
			res.redirect('/admin/admineditcourt/' + court)
		}
	})
})

/* A route handler. It is a function that is called when a request is made to the route. */
router.put("/updbook/:id", (req, res) => {
	bookDate = req.body.date;
	bookTime = req.body.time;
	court = req.body.court

	bookInfo.findByIdAndUpdate(req.params.id, {
		'bookDate': bookDate,
		'bookTime': bookTime,
		'court': court
	}, function (err, result) {
		if (err) {
			// res.json({status: "fail", message: "Customer failed to update"})
			req.flash("message", "Book failed to update")
			res.redirect('/admin/admineditbooking/' + req.params.id)
		} else {
			// res.json({status: "success", message: "Customer has been to updated"})
			req.flash("message", "Book has been updated!")
			res.redirect('/admin/admineditbooking/' + req.params.id)
		}
	})
})

/* This is a route handler. It is a function that is called when a request is made to the route. */
router.get("/deluser/:id", (req, res) => {
	CustomerInfo.findByIdAndRemove(req.params.id, function (err, result) {
		if (!err) {
			req.flash('message', 'User removed successfully!');
			res.redirect('/admin/adminviewuser');
		} else {
			req.flash('message', 'Failed to removed the user!');
			res.redirect('/admin/adminviewuser');
		}
	})
})

/* A route handler. It is a function that is called when a request is made to the route. */
router.get("/delcourt/:id", (req, res) => {
	bookInfo.deleteMany({ court: req.params.id }, function (err, result) {
	courtInfo.findByIdAndRemove(req.params.id, function (err, result) {
		if (!err) {
			req.flash('message', 'Court removed successfully!');
			res.redirect('/admin/admincourtmanage');
		} else {
			req.flash('message', 'Failed to removed the court!');
			res.redirect('/admin/admincourtmanage');
		}
	})
})
})

/* A route handler. It is a function that is called when a request is made to the route. */
router.get("/delbook/:id", (req, res) => {
	bookInfo.findByIdAndRemove(req.params.id, function (err, result) {
		if (!err) {
			req.flash('message', 'Booking removed successfully!');
			res.redirect('/admin/adminhistorybooking');
		} else {
			req.flash('message', 'Failed to removed the booking!');
			res.redirect('/admin/adminhistorybooking');
		}
	})
})


module.exports = router;