module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var Chat = require('../models/chat');
    var User = require('../models/user');
    var UnreadMessage = require('../models/unreadMessage');
    /*To get all the messages of the current user*/
    router.get('/', function(req, res, next) {
        UnreadMessage.find({
            userId: req.user._id
        }, function(err, messages) {
            if (err) {
                res.send({
                    error: err
                });
            }
            res.send(messages);
        });
    });
    /*To get the count of unread messages of the current user of  given journey*/
    router.get('/:id', function(req, res, next) {
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
    /*To delete the read messages*/
    router.delete('/:id', function(req, res, next) {
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