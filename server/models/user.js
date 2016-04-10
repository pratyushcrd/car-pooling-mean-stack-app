/**
 * Created by Pratyush on 28-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {type: String, required: true, index: {unique: true}},
    name: {type: String, required: true},
    gender: {type: String, required: true},
    profile_pic: {type: String, required: true},
    address: String,
    journeys: [{type: String, ref: 'Journey'}],
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User',UserSchema);
