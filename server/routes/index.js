var express = require('express');
var router = express.Router();
var City = require('../models/car.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    City.find({})
        .populate('user')
        .exec(function (err, cities) {
            if (err) {
                return next();
            }
            res.json(cities);
        });
});

router.post('/', function (req, res, next) {
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

module.exports = router;
