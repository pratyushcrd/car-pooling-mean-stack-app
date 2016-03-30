var express = require('express');
var router = express.Router();
var City = require('../models/city.js');
var Car = require('../models/car.js');
var User = require('../models/user.js');
var Journey = require('../models/journey.js');

// DELETE ALL ROUTE AFTER USAGE

/* GET home page. */
router.get('/city', function (req, res, next) {
    City.find({})
        .exec(function (err, cities) {
            if (err) {
                return next();
            }
            res.json(cities);
        });
});

router.post('/city', function (req, res, next) {
    var city = new City();
    city.car = req.body.car;
    city.user = req.body.user;
    city.save(function (err, city) {
        if (err) {
            return next();
        }
        res.json(city);
    });

});

router.get('/car', function (req, res, next) {
    Car.find({})
        .populate('user')
        .exec(function (err, cities) {
            if (err) {
                return next();
            }
            res.json(cities);
        });
});

router.post('/car', function (req, res, next) {
    var car = new Car();
    car.car = req.body.car;
    car.user = req.body.user;
    car.save(function (err, car) {
        if (err) {
            return next();
        }
        res.json(car);
    });

});

router.get('/user', function (req, res, next) {
    User.find({})
        .exec(function (err, cities) {
            if (err) {
                return next();
            }
            res.json(cities);
        });
});

router.post('/user', function (req, res, next) {
    var user = new User();
    user.car = req.body.car;
    user.user = req.body.user;
    user.save(function (err, user) {
        if (err) {
            return next();
        }
        res.json(user);
    });

});

module.exports = router;
