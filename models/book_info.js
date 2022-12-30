var mongoose = require("mongoose");

var book_infoSchema = new mongoose.Schema({
	custEmail: {type: String, required: true},
	vendorEmail:{type:String, required:true, default: "test@mail.com"},
	bookDate:{type: Date, required:true},
	bookTime:{type:Number, required:true},
	court: { type: String }
});

const bookInfo = mongoose.model("book", book_infoSchema);
module.exports = {bookInfo};
