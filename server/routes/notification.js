/**
 * Created by PRASHANT on 25-04-2016.
 */
module.exports = function (io) {
    var express = require('express');
    var router = express.Router();
    var User = require('../models/user');
    var Journey = require('../models/journey');
    var Notification = require('../models/notification');
    var ifLoggedIn = function (req, res, next) {
        if (req.user) {
            return next();
        }
        res.json({
            error: 'Not logged in'
        });
    };
    /*To get all the notifications of the current user*/
    router.get('/', ifLoggedIn, function (req, res, next) {
        Notification.find({userId: req.user._id}, function (err, notifications) {
            if (err) {
                return res.send({error: err});
            }

            Journey.populate(notifications, {
                path: 'journeyId'
            }, function (err, notifications) {
                if (err) {
                    return res.send({
                        error: err
                    });
                }
                User.populate(notifications, {
                    path: 'journeyId.posted_by'
                }, function (err, messages) {
                    if (err) {
                        return res.send({
                            error: err
                        });
                    }
                    res.send({notifications: notifications, count: notifications.length});
                });
            });
        });
    });
    /*To get the count of unread notifications of the current user of  given journey*/
    router.get('/:id', ifLoggedIn, function (req, res, next) {
        Notification.find({
            userId: req.user._id,
            journeyId: req.params.id
        }).count().exec(function (err, messageCount) {
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
    /*To delete the read notifications */
    router.delete('/:id', ifLoggedIn, function (req, res, next) {
        Notification.remove({
            userId: req.user._id,
            journeyId: req.params.id
        }, function (err, notifications) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            res.send({
                removed: notifications
            });
        })
    });
    return router;
};