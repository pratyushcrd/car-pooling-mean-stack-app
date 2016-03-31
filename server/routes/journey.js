/**
 * Created by Pratyush on 30-03-2016.
 */
'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var Journey = require('../models/journey.js');
/* GET users listing. */

var ifLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    res.json({error: 'Not logged in'});
};

router.get('/', function (req, res) {
    Journey
        .find({})
        .populate('posted_by', '_id email username')
        .exec(function (err, items) {
            res.json(items);
        });
});


router.post('/', ifLoggedIn, function (req, res) {
    var ob = new Journey();
    ob.start = {};
    ob.end = {};
    ob.posted_by = req.user._id;
    ob.start.street = req.body.start_street;
    ob.start.area = req.body.start_area;
    ob.end.street = req.body.end_street;
    ob.end.area = req.body.end_area;
    ob.departure = req.body.departure;
    ob.vehicle = req.body.vehicle;
    ob.seats = req.body.seats;
    ob.gender_preference = req.body.gender_preference;
    ob.stops = [];
    ob.description = req.body.description;
    ob.fare = req.body.fare;
    ob.requested_by = [];
    ob.accepted_requests = [];

    ob.save(function (err, item) {

        if (err) {
            return res.send(err);
        }
        res.json(item);

    });

});

module.exports = router;
