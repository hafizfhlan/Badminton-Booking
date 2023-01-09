var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var customer_infoSchema = new mongoose.Schema({
	password: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phoneNo : {type: String, required: true}
});

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

customer_infoSchema.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

const CustomerInfo = mongoose.model("customer", customer_infoSchema);
module.exports = { CustomerInfo };
