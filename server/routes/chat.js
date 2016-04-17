var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat');

var ifLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    res.json({
        error: 'Not logged in'
    });
};

router.get('/', ifLoggedIn, function (req, res, next) {
    Chat.find({senderId: req.user._id, receiverId: req.user._id}, {receiverId: req.user._id}, function (err, messages) {
        if (err) {
            return res.send({error: err});
        }
        res.send(messages);
    }).sort({_id: -1});
});

router.post('/', ifLoggedIn, function (req, res, next) {
    User.findOne({_id: req.body.receiverId}, function (err, user) {
        if (err) {
            return res.json({error: "User dose not exists"});
        }

        var newMessage = Chat();
        newMessage.message = req.body.message;
        newMessage.senderId = req.user._id;
        newMessage.receiverId = req.body.receiverId;
        newMessage.save(function (err, MessageDetail) {
            if (err) {
                res.send(err);
                return next();

            }
            res.send(MessageDetail);
        });

    });


});


module.exports = router;