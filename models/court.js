var mongoose = require("mongoose");

var courtInfoSchema = new mongoose.Schema({
	name: { type: String },
	status: {
		type: String,
		enum: ['available', 'not available'],
		default: 'available'
	}
});

const courtInfo = mongoose.model("court", courtInfoSchema);
module.exports = {courtInfo};
