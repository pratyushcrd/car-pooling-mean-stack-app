module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var User = require('../models/user');
    var UnreadMessage = require('../models/unreadMessage');
   
    router.get('/', function(req, res, next) {
        UnreadMessage.find({
            userId: req.user._id;
        }, function(err, messages){
        	 if(err){
        	 	res.send({error: err});
        	 }
        	 res.send(messages);
        });
    });
    return router;
}