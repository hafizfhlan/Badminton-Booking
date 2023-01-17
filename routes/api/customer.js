var express = require("express");
var bcrypt = require("bcryptjs");
// var popups = require("popups");
let alert = require("alert");

var router = express.Router();

const {
	default: mongoose
} = require("mongoose");
var {
	CustomerInfo
} = require("../../models/customer_info");
var {
	bookInfo
} = require("../../models/book_info");
var {
	courtInfo
} = require("../../models/court");
const {
	append
} = require("express/lib/response");
let {
	session
} = require("passport");

var Book = require("../../models/book_info");
var nodemailer = require('nodemailer')

var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "375ca65ef99fb0",
		pass: "e0db19d4564fbd"
	}
});


//TODO:: add in error and info

router.post("/register", async function (req, res, next) {
	if (
		!req.body.username ||
		!req.body.email ||
		!req.body.phoneNo ||
		!req.body.password ||
		!req.body.passwordConf
	) {
		alert("Fill in all detail required");
	} else {
		CustomerInfo.findOne({
			email: req.body.email
		}).then((customer) => {
			if (customer) {
				alert("Email already registered");
			} else {
				if (req.body.password != req.body.passwordConf) {
					alert("Wrong password input");
				} else {
					const data = new CustomerInfo({
						name: req.body.username,
						email: req.body.email,
						phoneNo: req.body.phoneNo,
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
					console.log(data.email)
					if (doMatch) {
						req.session.user = data.id;
						session = req.session.email;
						console.log(req.session.user)
						res.render("userdashboard");
					} else {
						req.flash("message", "Wrong Password")
						res.redirect('/login')
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			req.flash("message", "Email and Password does not matched")
			res.redirect('/login')
		}
	});
});

router.put("/updprofile", (req, res) => {

	email = req.body.email;
	name = req.body.name;
	phoneNo = req.body.phoneNo;
	customer = req.body.userID

	CustomerInfo.findByIdAndUpdate((customer), {
		'name': name,
		'email': email,
		'phoneNo': phoneNo
	}, function (err, result) {
		if (err) {
			// res.json({status: "fail", message: "Customer failed to update"})
			req.flash("message", "Customer failed to update")
			res.redirect('/customer/editprofile')
		} else {
			// res.json({status: "success", message: "Customer has been to updated"})
			req.flash("message", "Customer has been updated!")
			res.redirect('/customer/editprofile')
		}
	})
})

router.post("/userdashboard", function (req, res, next) {
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
						console.log(session);
						res.render("userdashboard", {
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


router.post("/editprofile", function (req, res, next) {
	const update = {
		name: req.body.name,
		email: req.body.name,
	};
	CustomerInfo.findOneAndUpdate({
			email: req.session.email
		}, update)
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


router.post("/book", async function (req, res, next) {

	var courtData = await courtInfo.findOne({
		_id: req.body.court
	})

	console.log(courtData)
	CustomerInfo.findOne({
		_id: req.body.id
	}, function (err, data) {
		if (data) {
			Book.bookInfo.findOne({
				bookDate: req.body.date,
				bookTime: req.body.time
			}, function (err, data1) {
				if (data1) {
					req.flash("message", "Timeslot already booked!")
					res.redirect('/customer/book')
				} else {
					customerData = data;
					const book1 = new Book.bookInfo({
						user: req.body.id,
						bookDate: req.body.date,
						bookTime: req.body.time,
						court: req.body.court,
					});

					book1.save((err, result) => {
						if (!err) {
							res.redirect('/customer/book')
						} else {
							console.log(err)
							res.json({
								status: 'Fail'
							})
						}
					})

					message = {
						from: "admin@gmail.com",
						to: data.email,
						subject: "Booking Badminton Court",
						text: data.email + " " + data.name + " " + data.phoneNo + '' + courtData.name,
						html: `<div class="receipt-content">
						<div class="container bootstrap snippets bootdey">
						  <div class="row">
							<div class="col-md-12">
							  <div class="invoice-wrapper">
								<div class="intro">
								  Hi <strong>${data.name}</strong>,
								  <br>
								  This is the booking for your booking courts.
								  <br>
								  <br>
								  Your Court:
								  ${courtData.name}
								  <br>
								  Date Booking:
								  ${req.body.date}
								  <br>
								  Time Booking:
								  ${req.body.time}
								</div>
					  
							   
					  
								<div class="payment-details">
								  <div class="row">
									<div class="col-sm-6">
									  <span>Client</span>
									  <strong>
									  <br>
										${data.name}
									  </strong>
									  <p>

										  Your email: ${data.email} <br>
										  Your phone no: ${data.phoneNo}
									  </p>
									</div>
								  </div>
								</div>
							  </div>
							</div>
						  </div>
						</div>
					  </div> 
					  <style>.receipt-content .logo a:hover {
						text-decoration: none;
						color: #7793C4; 
					  }
					  
					  .receipt-content .invoice-wrapper {
						background: #FFF;
						border: 1px solid #CDD3E2;
						box-shadow: 0px 0px 1px #CCC;
						padding: 40px 40px 60px;
						margin-top: 40px;
						border-radius: 4px; 
					  }
					  
					  .receipt-content .invoice-wrapper .payment-details span {
						color: #A9B0BB;
						display: block; 
					  }
					  .receipt-content .invoice-wrapper .payment-details a {
						display: inline-block;
						margin-top: 5px; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .print a {
						display: inline-block;
						border: 1px solid #9CB5D6;
						padding: 13px 13px;
						border-radius: 5px;
						color: #708DC0;
						font-size: 13px;
						-webkit-transition: all 0.2s linear;
						-moz-transition: all 0.2s linear;
						-ms-transition: all 0.2s linear;
						-o-transition: all 0.2s linear;
						transition: all 0.2s linear; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .print a:hover {
						text-decoration: none;
						border-color: #333;
						color: #333; 
					  }
					  
					  .receipt-content {
						background: #ECEEF4; 
					  }
					  @media (min-width: 1200px) {
						.receipt-content .container {width: 900px; } 
					  }
					  
					  .receipt-content .logo {
						text-align: center;
						margin-top: 50px; 
					  }
					  
					  .receipt-content .logo a {
						font-family: Myriad Pro, Lato, Helvetica Neue, Arial;
						font-size: 36px;
						letter-spacing: .1px;
						color: #555;
						font-weight: 300;
						-webkit-transition: all 0.2s linear;
						-moz-transition: all 0.2s linear;
						-ms-transition: all 0.2s linear;
						-o-transition: all 0.2s linear;
						transition: all 0.2s linear; 
					  }
					  
					  .receipt-content .invoice-wrapper .intro {
						line-height: 25px;
						color: #444; 
					  }
					  
					  .receipt-content .invoice-wrapper .payment-info {
						margin-top: 25px;
						padding-top: 15px; 
					  }
					  
					  .receipt-content .invoice-wrapper .payment-info span {
						color: #A9B0BB; 
					  }
					  
					  .receipt-content .invoice-wrapper .payment-info strong {
						display: block;
						color: #444;
						margin-top: 3px; 
					  }
					  
					  @media (max-width: 767px) {
						.receipt-content .invoice-wrapper .payment-info .text-right {
						text-align: left;
						margin-top: 20px; } 
					  }
					  .receipt-content .invoice-wrapper .payment-details {
						border-top: 2px solid #EBECEE;
						margin-top: 30px;
						padding-top: 20px;
						line-height: 22px; 
					  }
					  
					  
					  @media (max-width: 767px) {
						.receipt-content .invoice-wrapper .payment-details .text-right {
						text-align: left;
						margin-top: 20px; } 
					  }
					  .receipt-content .invoice-wrapper .line-items {
						margin-top: 40px; 
					  }
					  .receipt-content .invoice-wrapper .line-items .headers {
						color: #A9B0BB;
						font-size: 13px;
						letter-spacing: .3px;
						border-bottom: 2px solid #EBECEE;
						padding-bottom: 4px; 
					  }
					  .receipt-content .invoice-wrapper .line-items .items {
						margin-top: 8px;
						border-bottom: 2px solid #EBECEE;
						padding-bottom: 8px; 
					  }
					  .receipt-content .invoice-wrapper .line-items .items .item {
						padding: 10px 0;
						color: #696969;
						font-size: 15px; 
					  }
					  @media (max-width: 767px) {
						.receipt-content .invoice-wrapper .line-items .items .item {
						font-size: 13px; } 
					  }
					  .receipt-content .invoice-wrapper .line-items .items .item .amount {
						letter-spacing: 0.1px;
						color: #84868A;
						font-size: 16px;
					   }
					  @media (max-width: 767px) {
						.receipt-content .invoice-wrapper .line-items .items .item .amount {
						font-size: 13px; } 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total {
						margin-top: 30px; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total .extra-notes {
						float: left;
						width: 40%;
						text-align: left;
						font-size: 13px;
						color: #7A7A7A;
						line-height: 20px; 
					  }
					  
					  @media (max-width: 767px) {
						.receipt-content .invoice-wrapper .line-items .total .extra-notes {
						width: 100%;
						margin-bottom: 30px;
						float: none; } 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total .extra-notes strong {
						display: block;
						margin-bottom: 5px;
						color: #454545; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total .field {
						margin-bottom: 7px;
						font-size: 14px;
						color: #555; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total .field.grand-total {
						margin-top: 10px;
						font-size: 16px;
						font-weight: 500; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total .field.grand-total span {
						color: #20A720;
						font-size: 16px; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .total .field span {
						display: inline-block;
						margin-left: 20px;
						min-width: 85px;
						color: #84868A;
						font-size: 15px; 
					  }
					  
					  .receipt-content .invoice-wrapper .line-items .print {
						margin-top: 50px;
						text-align: center; 
					  }
					  
					  
					  
					  .receipt-content .invoice-wrapper .line-items .print a i {
						margin-right: 3px;
						font-size: 14px; 
					  }
					  
					  .receipt-content .footer {
						margin-top: 40px;
						margin-bottom: 110px;
						text-align: center;
						font-size: 12px;
						color: #969CAD; 
					  }                    </style>`
						// + data.email + "<br>" + data.name + "<br>" + data.phoneNo + '<br>' + courtData.name,                
					};
					transport.sendMail(message, function (err, info) {
						if (err) {
							console.log(err);
						} else {
							console.log(info);
						}
					});
				}
			})

		} else {
			res.json("Not Found")
		}
	});
});

module.exports = router;