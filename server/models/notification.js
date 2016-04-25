var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    notification: {type: String, required: true},
    journeyId: {type: String, required: true},
    userId: {type: String, required: true},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Notification', NotificationSchema);
