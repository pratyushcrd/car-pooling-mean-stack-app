module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var Chat = require('../models/chat');
    var Vehicle = require('../models/vehicle');
    var User = require('../models/user');
    var Journey = require('../models/journey');
    var UnreadMessage = require('../models/unreadMessage');
    var ifLoggedIn = function(req, res, next) {
        if (req.user) {
            return next();
        }
        res.json({
            error: 'Not logged in'
        });
    };
    /*To get all the messages of the current user*/
    router.get('/', ifLoggedIn, function(req, res, next) {
        UnreadMessage.aggregate().match({
            userId: {
                $eq: req.user._id.toString()
            }
        }).project({
            message: '$message',
            journeyId: '$journeyId',
            userId: '$userId'
        }).group({
            _id: '$journeyId',
            occurance: {
                $sum: 1
            },
            message: {
                $max: '$message'
            }
        }).exec(function(err, messages) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            Journey.populate(messages, {
                path: '_id'
            }, function(err, messages) {
                if (err) {
                    return res.send({
                        error: err
                    });
                }
                User.populate(messages, {
                    path: '_id.posted_by'
                }, function(err, messages) {
                    if (err) {
                        return res.send({
                            error: err
                        });
                    }
                    res.send(messages);
                });
            });
        });
    });
    /*To get the count of unread messages of the current user of  given journey*/
    router.get('/:id', ifLoggedIn, function(req, res, next) {
        UnreadMessage.find({
            userId: req.user._id,
            journeyId: req.params.id
        }).count().exec(function(err, messageCount) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            res.send({
                count: messageCount
            });
        });
    });
    /*To delete the read messages INSECURE */
    router.delete('/:id', ifLoggedIn, function(req, res, next) {
        UnreadMessage.remove({
            userId: req.user._id,
            journeyId: req.params.id
        }, function(err, messages) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            res.send({
                removed: messages
            });
        })
    });
    return router;
};