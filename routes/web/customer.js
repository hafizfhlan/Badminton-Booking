var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
let {
	session
} = require("passport");
const {
	CustomerInfo
} = require("../../models/customer_info");
var {
	bookInfo
} = require('../../models/book_info')
const {
	courtPrice
} = require("../../models/court_price");
const {
	courtInfo
} = require("../../models/court");

const court = require("../../models/court")
var router = express.Router();
var nodemailer = require('nodemailer')

/* Creating a transport object for nodemailer. */
var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "375ca65ef99fb0",
		pass: "e0db19d4564fbd"
	}
});



router.get("/login", function (req, res) {
	res.render("login");
})



router.get("/dashboard", function (req, res) {
	res.render("userdashboard");
})


/* This is a route handler for the userprofile page. */
router.get("/userprofile", function (req, res, next) {
	CustomerInfo.findOne({
		_id: req.session.user
	}, function (err, data) {
		if (data) {
			res.render("userprofile", {
				name: data.name,
				email: data.email,
				phoneNo: data.phoneNo,
				userID: data.id
			});
		} else {
			res.render("userdashboard");
		}
	});
});

/* This is a route handler for the editprofile page. */
router.get("/editprofile", function (req, res) {
	CustomerInfo.findOne({
		_id: req.session.user
	}, function (err, data) {
		if (data) {
			res.render("editprofile", {
				name: data.name,
				email: data.email,
				phoneNo: data.phoneNo,
				userID: data.id
			});
		} else {
			res.render("userdashboard");
		}
	})
})

/* Finding the courtPrice collection and populating the user and court fields. */
router.get("/book", async function (req, res) {
	var cp = await courtPrice.find();
	court.courtInfo.find({
		status: 'available'
	}, (err, data) => {
		res.render("bookingcourt", {
			id: req.session.user,
			data: data,
			cp: cp
		});
	})

})

// router.get("/history", function(req, res){
//     var d1, d2;

//     bookInfo.find({}, (err, data) => {
//         if(data) {
//             res.render('history', {data:data})
//         }
//     })  


// })

/* Finding the bookInfo collection and populating the user and court fields. */
router.get("/cancelbooking/", function (req, res) {
	bookInfo.find({
		user: req.session.user
	}).populate({
		path: "user",
		select: {
			'password': 0
		}
	}).populate({
		path: "court",
	}).exec().then((data) => {
		res.render("cancelbooking.ejs", {
			data: data
		})
	})
})

/* Finding the bookInfo collection and populating the user and court fields. */
router.get("/history", (req, res, ) => {
	bookInfo.find({
		user: req.session.user
	}).populate({

		path: "user",
		select: {
			'password': 0
		}
	}).populate({
		path: "court",
	}).exec().then((data) => {
		res.render("history.ejs", {
			data: data
		})
	})
	// console.log(req.session);

	// bookInfo.find(({userEmail: req.session.email}),(err, docs) => {
	// if (!err) {
	// 	res.render("history.ejs", {
	// 		data: docs
	// 	});
	// } else {
	// 	console.log('Failed to retrieve the booking List: ' + err);
	// }
	// });



});

module.exports = router;