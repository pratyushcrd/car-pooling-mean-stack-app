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
    passport.authenticate('facebook', function(user, err) {
        res.send(user);
    })(req, res, next);
});
<<<<<<< HEAD
/* logout */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
=======

router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
>>>>>>> e2ab1e098068e375962845b8f3e06cedf4189aa7
module.exports = router;