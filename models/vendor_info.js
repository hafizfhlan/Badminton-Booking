var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var vendor_infoSchema = new mongoose.Schema({
	password: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone_no: { type: String, required: true },
	statusV: { type: Boolean, required: true },
});

vendor_infoSchema.pre("save", function (done) {
	var vendor = this;
	if (!vendor.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(vendor.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			vendor.password = hashedPassword;
			done();
		});
	});
});

vendor_infoSchema.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

const VendorInfo = mongoose.model("vendor", vendor_infoSchema);
module.exports = { VendorInfo };
