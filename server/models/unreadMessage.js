/**
 * Created by Pratyush on 16-04-2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var unreadMessageSchema = new Schema({
    message: {type: String, required: true},
    journeyId: {type: String, required: true, ref: 'User'},
    userId: {type: String, required: true, ref: 'User'},
    postedBy:{type: String, required: true, ref: 'User'},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('UnreadMessage', unreadMessageSchema);
