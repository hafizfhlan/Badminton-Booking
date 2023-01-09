var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
let { session } = require("passport");
const { CustomerInfo } = require("../../models/customer_info");
var {bookInfo} = require('../../models/book_info')

const court = require("../../models/court")
var router = express.Router();

router.get("/login", function(req, res){
    res.render("login");
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
				phoneNo: data.phoneNo,
				userID: data.id
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
				phoneNo: data.phoneNo,
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

// router.get("/history", function(req, res){
//     var d1, d2;

//     bookInfo.find({}, (err, data) => {
//         if(data) {
//             res.render('history', {data:data})
//         }
//     })  

    
// })

router.get("/history",(req, res,)=>{
	
	console.log(req.session);

	bookInfo.find(({userEmail: req.session.email}),(err, docs) => {
	if (!err) {
		res.render("history.ejs", {
			data: docs
		});
	} else {
		console.log('Failed to retrieve the booking List: ' + err);
	}
	});
	
	

});

module.exports = router;