var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");

/* A constant that is used to generate a salt for the password. */
const SALT_FACTOR = 10;

/* Creating a schema for the database. */
var admin_infoSchema = new mongoose.Schema({
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
});

/* This is a function that is used to hash the password before saving it to the database. */
admin_infoSchema.pre("save", function (done) {
	var admin = this;
	if (!admin.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(admin.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			admin.password = hashedPassword;
			done();
		});
	});
});

/* This is a function that is used to check if the password is correct. */
admin_infoSchema.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

/* Creating a model for the database. */
const AdminInfo = mongoose.model("admin", admin_infoSchema);
module.exports = {
	AdminInfo
};