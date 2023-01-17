var mongoose = require("mongoose");

var book_infoSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'customer'},
	bookDate:{type: Date, required:true},
	bookTime:{type:String, required:true},
	court: {type: mongoose.Schema.Types.ObjectId, ref: 'court'},
});

const bookInfo = mongoose.model("book", book_infoSchema);
module.exports = {bookInfo};
