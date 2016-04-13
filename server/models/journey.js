/**
 * Created by Pratyush on 29-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JourneySchema = new Schema({
    posted_by: {type: String, required: true, ref: 'User'},
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
    vehicle: {type: String, required: true, ref: 'Vehicle'},
    availableSeats: {type: Number, required: true, min: 1, max: 5},
    genderPreference: {type: String, default: 'none'},
    stops: [String],
    description: String,
    fare: {type: Number, required: true},
    requested_by: [{
        name: {type: String},
        requestTime: {type: Date, default: Date.now()},
    }],
    accepted_requests: [{
        name: {type: String},
        acceptedTime: {type: Date, default: Date.now()},
        //city: {type: Schema.ObjectId, required: true, ref: 'City'}
    }],
    created_at: {type: Date, default: Date.now()}
});


module.exports = mongoose.model('Journey', JourneySchema);
