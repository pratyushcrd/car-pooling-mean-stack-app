/**
 * Created by Pratyush on 29-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    car: {type: String, required: true},
    user: {type: Schema.ObjectId, required: true, ref: 'User'},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Car', CarSchema);
