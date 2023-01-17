var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
let { session } = require("passport");
// const ejsLint = require("ejs-lint");
var router = express.Router();

var {AdminInfo} = require('../../models/admin_info')
var {CustomerInfo} = require('../../models/customer_info');
var {bookInfo} = require('../../models/book_info')
const {court, courtInfo} = require('../../models/court')


router.get("/admindashboard", function(req, res){
    res.render("admin/admindashboard");
})



router.get("/adminviewuser", function(req, res){
    var cust;
    var adm;

    CustomerInfo.find({}, (err, data1) => {
        res.render("admin/adminviewuser", {data: data1});
    })
})

router.get("/register", function(req, res){
    res.render("admin/register");
})

router.get("/login", function(req, res){
    res.render("admin/login");
})

router.get("/admincourtmanage", function(req, res){
    var cust;
    var adm;
    
    courtInfo.find({}, (err, data1) => {
        res.render("admin/admincourtmanage", {data: data1});
    })
   
})

router.get("/adminaddcourt", function(req, res){
    res.render("admin/adminaddcourt");
})

router.get("/admineditcourt/:id", function(req, res){
    // console.log(req.params)
    // bookInfo.find({}, function(err,data) {
    //     if(err) {
    //         console.log(err)
    //     }
    //     else {
    //         console.log(data)
    //     }
    // })
    courtInfo.findById(req.params.id, (err, data) => {
        if(data) {
            console.log(data)
            res.render("admin/admineditcourt", {data: data});
        } else {
            res.send("tak ada")
        }
    })
})

router.get("/adminhistorybooking", function(req, res){
    bookInfo.find().populate({
        path: "user",
        select: {'email':1}
    }).populate({
        path: "court"
    }).exec().then((data) => {
            res.render('admin/adminhistorybooking', {data:data})
    })

    
})

router.get("/admineditbooking/:id", function(req, res){
    bookInfo.findOne({id:req.params.id}).populate({
		path: "user",
		select: {'password':0}
	}).populate({
		path: "court",
	}).exec().then((data) => {
        courtInfo.find({},(err,dataCourt) => {
            console.log(dataCourt)
            res.render("admin/admineditbooking",{id: req.params.id,data:data, dataCourt: dataCourt})
        })
	})
    //     bookInfo.findOne({id: req.params.id }, function (err, data) {
// 		if (data) {
//             console.log(data)
// 			res.render("admin/admineditbooking", {
//                 id: req.params.id,
// 				userEmail: data.userEmail, 
// 				date: data.bookDate,
//                 time: data.bookTime,
//                 court: data.court
// 			});
// 		} else {
// 			res.render("admindashboard");
// 		}
// })
})

router.get("/map", function(req,res){
    console.log("test1")
    res.render("admin/testmap")
})

module.exports = router;
