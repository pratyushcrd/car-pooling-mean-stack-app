var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, car) {
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
        if (user.user) {
            req.logIn(user.user, function(err) {});
        }
        res.redirect('/');
    })(req, res, next);
});
/* logout */
router.get('/logout', function(req, res) {
    req.logout();
    res.send({
        success: 'Logout successful'
    });
});
/* Get Current User */
router.get('/user', function(req, res) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.json({
            error: 'Not Logged In!'
        });
    }
});
/* Demo login */
router.get('/dlogin', function(req, res) {
    User.findOne({}, function(err, user) {
        if (err || !user) {
            return res.send('False');
        }
        req.logIn(user, function(err) {});
        res.json(req.user);
    });
});
router.get('/pblogin', function(req, res) {
    User.findOne({
        _id: '571262c6b5178cac0c99f9d2'
    }, function(err, user) {
        if (err || !user) {
            return res.send('False');
        }
        req.logIn(user, function(err) {});
        res.json(req.user);
    });
});
router.get('/full', function(req, res) {
    if (!req.user) {
        return res.send({
            error: 'Not logged in'
        });
    }
    User.findOne({
        _id: req.user._id
    }).populate({
        path: 'journeys',
        populate: {
            path: 'vehicle posted_by accepted_requests.id',
            select: ' type png _id profile_pic name'
        }
    }).exec(function(err, user) {
        if (err || !user) {
            return res.send('False');
        }
        req.logIn(user, function(err) {});
        res.json(req.user);
    });
});
module.exports = router;