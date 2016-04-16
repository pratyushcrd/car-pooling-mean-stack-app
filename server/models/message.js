/**
 * Created by Pratyush on 16-04-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    message: {type: String, required: true},
    postedBy: {type: String, required: true, ref: 'User'},
    postedTo: {type: String, required: true, ref: 'User'},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Message', MessageSchema);
