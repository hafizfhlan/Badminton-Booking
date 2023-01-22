var express = require("express");
var passport = require("passport");
const {
	route
} = require("./admin");

/* Importing the pdfService module. */
const pdfService = require("../../pdf");
var router = express.Router();


router.get("/", function (req, res) {
	res.render("index")
})

router.get("/login", function (req, res) {
	res.render("login")
})

router.get("/register", function (req, res) {
	res.render("register")
})

router.get("/userprofile", function (req, res) {
	res.render("userprofile");
})

router.get("/guestbooking", function (req, res) {
	res.render("guestbooking")
})


/* This is a route that is used to logout the user. */
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

/* A route that is used to generate a PDF file. */
router.get("/invoice", function (req, res, next) {
	const stream = res.writeHead(200, {
		'Content-Type': 'Report/pdf',
		'content-disposition': 'attachment; filename= Report.pdf',
	});

	pdfService.buildPDF(
		(chunk) => stream.write(chunk),
		() => stream.end()
	)
});

router.use("/customer", require("./customer"));
router.use("/admin", require("./admin"));
// router.use("/staff", require("./staff"));

module.exports = router;