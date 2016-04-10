/**
 * Created by PRASHANT on 10-04-2016.
 */
var express = require('express');
var router = express.Router();
var Car = require('../models/car');
var Journey = require('../models/journey');
/* GET list of all the journeys . */
router.get('/', function (req, res, next) {
    Journey.find(function (err, journey) {
        if (err)
            return res.send(err);
        res.json(journey);
    });
});
/* To add new journeys . */
router.post('/', function (req, res, next) {
    var newJourney = new Journey();
    newJourney.start = {};
    newJourney.end = {};
    //console.log(req);
    console.log(req.body);
    newJourney.start.street = req.body.startStreet;
    newJourney.start.area = req.body.startArea;
    newJourney.end.street = req.body.endStreet;
    newJourney.end.area = req.body.endArea;
    newJourney.departure = req.body.departure;
    newJourney.vehicle = req.body.vehicle;
    newJourney.availableSeats = req.body.availableSeats;
    newJourney.gender_preference = req.body.gender_preference;
    newJourney.description = req.body.description;
    newJourney.fare = req.body.fare;
    newJourney.save(function (err, journeyDetail) {
        if (err) {
            res.send(err);
            return next();
        }
        res.send(journeyDetail);
    });

});
/* To delete the journeys . */
router.delete('/:id', function (req, res, next) {
    Journey.findOneAndRemove({_id: req.params.id}, function (err, deletedJourney) {
        if (err) {
            res.send(err);
            return next();
        }
        res.send(deletedJourney)
    });

});

module.exports = router;