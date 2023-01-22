var mongoose = require("mongoose");

/* Creating a schema for the courtInfo model. */
var courtInfoSchema = new mongoose.Schema({
	name: {
		type: String
	},
	status: {
		type: String,
		enum: ['available', 'not available'],
		default: 'available'
	}
});

/* Creating a model called courtInfo. */
const courtInfo = mongoose.model("court", courtInfoSchema);
module.exports = {
	courtInfo
};