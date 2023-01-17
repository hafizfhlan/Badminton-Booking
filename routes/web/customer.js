var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
let { session } = require("passport");
const { CustomerInfo } = require("../../models/customer_info");
var {bookInfo} = require('../../models/book_info')

const court = require("../../models/court")
var router = express.Router();
var nodemailer = require('nodemailer')

var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
	  user: "375ca65ef99fb0",
	  pass: "e0db19d4564fbd"
	}
  });

 

router.get("/login", function(req, res){
    res.render("login");
})



router.get("/dashboard", function(req, res){
    res.render("userdashboard");
})


router.get("/userprofile", function (req, res, next) {
	console.log()
	console.log(req.session.user)
	CustomerInfo.findOne({ _id: req.session.user }, function (err, data) {
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
	CustomerInfo.findOne({ id: req.session.user }, function (err, data) {
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
	court.courtInfo.find({status:'available'}, (err, data) => {
		res.render("bookingcourt", {id: req.session.user, data: data});
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
	bookInfo.find({user: req.session.user}).populate({
		
		path: "user",
		select: {'password':0}
	}).populate({
		path: "court",
	}).exec().then((data) => {
		res.render("history.ejs",{data:data})
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