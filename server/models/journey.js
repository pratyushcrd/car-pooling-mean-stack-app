/**
 * Created by Pratyush on 29-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JourneySchema = new Schema({
    start: {
        street: {type: String, required: true},
        area: {type: String, required: true},
        city: {type: Schema.ObjectId, required: true, ref: 'City'}
    },
    end: {
        street: {type: String, required: true},
        area: {type: String, required: true},
        city: {type: Schema.ObjectId, required: true, ref: 'City'}
    }
});


module.exports = mongoose.model('Journey', JourneySchema);
