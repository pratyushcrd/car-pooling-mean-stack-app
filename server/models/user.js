/**
 * Created by Pratyush on 28-03-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},
    gender: {type: String, required: true},
    age: {type: Number, required: true},
    address: String,
    created_at: {type: Date, default: Date.now()}
});


UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'email not valid');

UserSchema.path('gender').validate(function (gender) {
    return gender === 'male' || gender === 'female';
}, 'gender can only be \'male\' or \'female\'');


module.exports = mongoose.model('User',UserSchema);
