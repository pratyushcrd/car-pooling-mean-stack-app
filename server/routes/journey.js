/**
 * Created by PRASHANT on 10-04-2016.
 */
var express = require('express');
var router = express.Router();
var Car = require('../models/car');
var Journey = require('../models/journey');
var User = require('../models/user');
var Vehicle = require('../models/vehicle')
var ifLoggedIn = function(req, res, next) {
        if (req.user) {
            return next();
        }
        res.json({
            error: 'Not logged in'
        });
    }
    /* GET list of all the journeys . */
router.get('/journeys/', function(req, res, next) {
    Journey.find({
        departure: {
            $gt: new Date()
        }
    }).lean().populate('posted_by vehicle').exec(function(err, journeys) {
        if (err) return res.send(err);
        res.json(journeys);
    });
});
/* GET list of all the past journeys . */
router.get('/journeys/past', function(req, res, next) {
    Journey.find({
        departure: {
            $lt: new Date()
        }
    }).lean().sort('-departure').limit(5).populate('posted_by vehicle').exec(function(err, journeys) {
        if (err) return res.send(err);
        res.json(journeys);
    });
});
/* GET list of all the journeys of current user . */
router.get('/journeys/user', ifLoggedIn, function(req, res, next) {
    Journey.find({
        posted_by: req.user._id
    }).lean().sort('-departure').limit(5).populate('posted_by vehicle').exec(function(err, journeys) {
        if (err) return res.send(err);
        res.json(journeys);
    });
});
/* Make a request to a journey */
router.post('/journeys/:id/request', ifLoggedIn, function(req, res) {
    Journey.findOne({_id: req.params.id}, function(err, journey){
        if(err || !journey){
            return res.send({error: 'Post Not found'});
        }
        if(!req.body.seats || req.body.seats > journey.availableSeats){
            return res.send({error: 'Seats invalid'});
        }

        for(var index in journey.requested_by){
            if(journey.requested_by[index].id == (req.user._id)){
                return res.send({error: 'Cannot post multiple requests'});
            }
        }

        for(var index in journey.accepted_requests){
            if(journey.accepted_requests[index].id == (req.user._id)){
                return res.send({error: 'Already in the journey'});
            }
        }
        journey.requested_by.push({id: req.user._id, seatsRequired: req.body.seats});
        journey.save(function(err, journey){
            if(err){
                return res.send(err);
            }
            return res.send(journey);
        });

    });
});
/* Decline a request ******INSECURE******* */
router.delete('/journeys/:id/request/:uid', ifLoggedIn, function(req, res) {
    Journey.findOne({_id: req.params.id}, function(err, journey){
        if(err || !journey){
            return res.send({error: 'Post Not found'});
        }
        var position = -1;
        for(var index in journey.requested_by){
            if(journey.requested_by[index].id == (req.params.uid)){
                position = index;
            }
        }

        if(position == -1){
            return res.send({error: 'No request from the user'});
        }

        journey.requested_by.pull(journey.requested_by[position]);
        journey.save(function(err, journey){
            if(err){
                return res.send({error: err});
            }
            return res.send(journey);
        });

    });
});
/* Accept a request in a journey */
router.post('/journeys/:id/accept/:uid', ifLoggedIn, function(req, res) {
    Journey.findOne({_id: req.params.id}, function(err, journey){
        if(err || !journey){
            return res.send({error: 'Post Not found'});
        }
        var position = -1;
        for(index in journey.requested_by){
            var request = journey.requested_by[index];
            if(request.id == req.params.uid){
                if(request.seatsRequired <= journey.availableSeats){
                    position = index;
                }else{
                    return res.send({error: 'Seats not available'});
                }
            }
        }
        if(position == -1){
            return res.send({error: 'Could not find request entry'});
        }else{
            var request = journey.requested_by[position];
            journey.requested_by.pull(request);
            journey.accepted_requests.push(request);
            journey.availableSeats = journey.availableSeats - request.seatsRequired;
            journey.save(function(err, journey){
                if(err || !journey){
                    return res.send({error: err});
                }else{
                    User.findOne({_id: req.params.uid}, function(err, user){
                        if(err){
                            return res.send({error: err});
                        }
                        user.journeys.push(req.params.id);
                        user.save(function(err, user){
                            if(err || !user){
                                return res.send({error: err});
                            }
                            return res.send(journey);
                        });
                    });  
                }
            });
        }

    });
});
/* GET list of all the journeys of the user. */
router.get('/users/:uid/journeys/', function(req, res, next) {
    Journey.find({
        posted_by: req.params.uid
    }).populate('posted_by').exec(function(err, journey) {
        if (err) return res.send(err);
        res.json(journey);
    });
});
/* To add new journeys . */
router.post('/journeys', ifLoggedIn, function(req, res, next) {
    if(!req.body.availableSeats || req.body.availableSeats < 1){
        return res.send({error: 'Seats must be minimum 1'});
    }
    var newJourney = new Journey();
    newJourney.start = {};
    newJourney.end = {};
    newJourney.start.street = req.body.startStreet;
    newJourney.start.area = req.body.startArea;
    newJourney.end.street = req.body.endStreet;
    newJourney.end.area = req.body.endArea;
    newJourney.departure = req.body.departure;
    newJourney.vehicle = req.body.vehicle;
    newJourney.availableSeats = req.body.availableSeats;
    newJourney.genderPreference = req.body.genderPreference;
    newJourney.description = req.body.description;
    newJourney.fare = req.body.fare;
    newJourney.posted_by = req.user._id;
    newJourney.save(function(err, journeyDetail) {
        if (err) {
            return res.send(err);
        }
        req.user.journeys.push(journeyDetail._id);
        req.user.save(function(err, user) {
            res.send(journeyDetail);
        });
    });
});
/* To delete the journeys . */
router.delete('/journeys/:id', ifLoggedIn, function(req, res, next) {
    Journey.findOneAndRemove({
        _id: req.params.id
    }, function(err, deletedJourney) {
        if (err) {
            return res.send(err);
        }
        req.user.journeys.pull(deletedJourney._id);
        req.user.save(function(err, user) {
            res.send(deletedJourney);
        });
    });
});
/* To Get one journeys . */
router.get('/journeys/:id', function(req, res, next) {
    Journey.findOne({
        _id: req.params.id
    }).populate('posted_by vehicle accepted_requests.id requested_by.id').exec(function(err, journey) {
        if (err) {
            return res.send(err);
        }
        res.send(journey);
    });
});
/* To Delete one journeys . */
router.delete('/journeys/:id', function(req, res, next) {
    Journey.findOneAndRemove({
        _id: req.params.id
    }).exec(function(err, journey) {
        if (err) {
            return res.send(err);
        }
        res.send(journey);
    });
});
module.exports = router;