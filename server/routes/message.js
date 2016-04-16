var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Message = require('../models/message');

var ifLoggedIn =function(req, res, next){
	  if (req.user) {
            return next();
        }
        res.json({
            error: 'Not logged in'
        });
}

router.get('/', ifLoggedIn, function(req, res, next){
	Message.find({postedBy: req.user._id}, function(err, messages){
		if (err) {
			res.send(err);
			return next();
		}
		res.send(messages);
	});
});

router.post('/', ifLoggedIn, function(req, res, next){
	var newMessage = Message();
	newMessage.message = req.body.message;
	newMessage.postedBy = req.user._id;
	newMessage.postedTo = "SomeOne";
	newMessage.save(function(err, MessageDetail){
		if (err) {
			res.send(err);
			return next();

		}
		res.send(MessageDetail);
	});

});


module.exports = router;