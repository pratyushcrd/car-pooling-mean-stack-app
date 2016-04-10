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
/* Transfer call to facebook */
router.get('/auth/facebook', passport.authenticate('facebook'));
/* Handle callback requests */
router.get('/facebook/callback', function(req, res, next) {
    console.log('Enter');
    passport.authenticate('facebook', function(user) {
        // Checking if user object is present
        if(user.user){
            req.logIn(user.user, function(err){});
        }
        res.send(user);
    })(req, res, next);
});
/* logout */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
/* Get Current User */
router.get('/user', function (req, res) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.json({error: 'Not Logged In!'});
    }
});
module.exports = router;
