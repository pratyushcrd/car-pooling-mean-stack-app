/**
 * Created by Pratyush on 29-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JourneySchema = new Schema({
    city: {type: String, required: true, index: {unique: true}}
});


module.exports = mongoose.model('Journey', JourneySchema);
