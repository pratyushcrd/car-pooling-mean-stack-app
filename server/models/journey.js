/**
 * Created by Pratyush on 29-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JourneySchema = new Schema({
    posted_by: {type: Schema.ObjectId, required: true, ref: 'User'},
    start: {
        street: {type: String, required: true},
        area: {type: String, required: true},
        //city: {type: Schema.ObjectId, required: true, ref: 'City'}
    },
    end: {
        street: {type: String, required: true},
        area: {type: String, required: true},
        //city: {type: Schema.ObjectId, required: true, ref: 'City'}
    },
    departure: {type: Date, required: true},
    vehicle: {type: String, required: true},
    seats: {type: Number, required: true, min: 1, max: 5},
    gender_preference: {type: String, default: 'none'},
    stops: [String],
    description: String,
    fare: {type: Number, required: true},
    requested_by: [Schema.ObjectId],
    accepted_requests: [Schema.ObjectId],
    created_at: {type: Date, default: Date.now()}
});


module.exports = mongoose.model('Journey', JourneySchema);
