var express = require('express');
var router = express.Router();
var Car = require('../models/car');
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
    Car.find({}, function(err, car) {
        res.json(car);
    });
});
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', function(req, res, next) {
    console.log('Enter');
    passport.authenticate('facebook', function(user, err){

    	console.log('Enter last');
    	console.log(user);
    	console.log(err);
    	res.send(user);

    })(req, res, next);

});
module.exports = router;