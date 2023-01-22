var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");

/* A constant that is used to generate a salt for the password. */
const SALT_FACTOR = 10;

/* Creating a schema for the customer_info collection. */
var customer_infoSchema = new mongoose.Schema({
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phoneNo: {
		type: String,
		required: true
	}
});

/* This is a pre-save hook that is used to hash the password before saving it to the database. */
customer_infoSchema.pre("save", function (done) {
	var customer = this;
	if (!customer.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(customer.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			customer.password = hashedPassword;
			done();
		});
	});
});

/* This is a method that is used to check if the password entered by the user is correct or not. */
customer_infoSchema.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

/* Creating a model for the customer_info collection. */
const CustomerInfo = mongoose.model("customer", customer_infoSchema);
module.exports = {
	CustomerInfo
};