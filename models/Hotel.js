var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var HotelSchema = new Schema({
    //id: String,
    id: Number,
    name: String,
    stars: Number,
    price: SchemaTypes.Double,
    image: String,
    amenities: Array
});

var Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = Hotel;