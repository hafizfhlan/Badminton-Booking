var mongoose = require("mongoose");

/* Creating a new schema for the collection "courtprice" and then creating a new model for the
collection "courtprice" using the schema. */
var courtPriceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number
    }
});
const courtPrice = mongoose.model("courtprice", courtPriceSchema);

/* Checking if the collection has a document with the name "Weekend". If it does not, it will create a
new document with the name "Weekend" and the price 15.00. */
courtPrice.find({
    name: "Weekend"
}, function (err, data) {
    if (data.length == 0) {
        var tmp = new courtPrice({
            name: "Weekend",
            price: 15.00
        }).save();

    }
})

/* Checking if the collection has a document with the name "Weekday". If it does not, it will create a
new document with the name "Weekday" and the price 12.00. */
courtPrice.find({
    name: "Weekday"
}, function (err, data) {
    if (data.length == 0) {
        var tmp = new courtPrice({
            name: "Weekday",
            price: 12.00
        }).save();
    }
})

module.exports = {
    courtPrice
};