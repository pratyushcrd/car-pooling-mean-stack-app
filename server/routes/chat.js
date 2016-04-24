module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var User = require('../models/user');
    var Chat = require('../models/chat');
    var UnreadMessage = require('../models/unreadMessage');
    var Journey = require('../models/journey');
    var ifLoggedIn = function(req, res, next) {
        if (req.user) {
            return next();
        }
        res.json({
            error: 'Not logged in'
        });
    };
    router.get('/', ifLoggedIn, function(req, res, next) {
        Chat.find({
            journeyId: req.query.jid
        }).sort({
            _id: -1
        }).populate('userId').exec(function(err, messages) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            res.send(messages);
        });
    });
    /*Async required*/
    router.post('/', ifLoggedIn, function(req, res, next) {
        Journey.findOne({
            _id: req.body.jid
        }, function(err, journey) {
            if (err || !journey) {
                return res.json({
                    error: "Journey dose not exists"
                });
            } else {
                var flag = 0;
                for (index in req.user.journeys) {
                    var userJourney = req.user.journeys[index];
                    console.log(userJourney);
                    console.log(req.body.jid);
                    if (userJourney == req.body.jid) {
                        flag = 1;
                    }
                }
                if (flag == 1) {
                    var newMessage = new Chat();
                    newMessage.message = req.body.message;
                    newMessage.userId = req.user._id;
                    newMessage.journeyId = req.body.jid;
                    newMessage.save(function(err, message) {
                        if (err) {
                            return res.send({
                                error: err
                            });
                        }
                        var userArray = journey.accepted_requests;
                        userArray.push({id: journey.posted_by});
                        for (index in userArray) {
                            var userId = userArray[index].id;
                            if (userId == req.user._id) {
                                continue;
                            }
                            var newUnreadmessage = UnreadMessage();
                            newUnreadmessage.userId = userId;
                            newUnreadmessage.message = req.body.message;
                            newUnreadmessage.postedBy = req.user._id;
                            newUnreadmessage.journeyId = req.body.jid;
                            newUnreadmessage.save(function (err, Unreadmessage) {
                                if (err) {
                                    return res.send({
                                        error: err
                                    });
                                }
                            });
                        }


                        message.userId = req.user;
                        io.emit('chat' + req.body.jid, message);
                        return res.send(message);
                    });
                } else {
                    return res.send({
                        error: "You are not authorized"
                    });
                }
            }
        });
    });
    return router;
};