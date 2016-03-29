'use strict'

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
/* GET users listing. */

var sendUserData = function (res, user) {
    var ob = {};
    ob.user = {};
    ob.user.id = user._id;
    ob.user.email = user.email;
    ob.user.username = user.username;
    res.json(ob);
};

var ifLoggedIn = function(req, res, next){
    if(req.user){
        return next();
    }
    res.json({error: 'Not logged in'});
};


router.post('/login', function (req, res) {
    passport.authenticate('login', function (err, user) {
        if (!user) {
            res.json({error: err});
        } else {
            req.logIn(user, function (err) { // When using authenticate manually log in manually
                return sendUserData(res, user);
            });
        }
    })(req, res);
});

router.post('/signup', function (req, res, next) {

    passport.authenticate('signup', function (err, user) {
        if (err) {
            if((err.message + '').indexOf('duplicate') > -1){
                res.json({error: 'email exists'});
            }else{
                res.json({error: err.message});
            }
            console.log(err);
        } else {
            sendUserData(res, user);
        }
    })(req, res, next);

});

router.get('/user', function (req, res) {
    if (req.user) {
        sendUserData(res, req.user);
    } else {
        res.json({error: 'Not Logged In!'});
    }
});

router.get('/username/:id', function (req, res) {
    User.findOne({username: req.params.id}, function(err, user){
        if(user){
            res.json({used: req.params.id});
            return;
        }
        res.json({available: req.params.id});
    });
});

router.get('/email/:id', function (req, res) {
    User.findOne({email: req.params.id}, function(err, user){
        if(user){
            res.json({used: req.params.id});
            return;
        }
        res.json({available: req.params.id});
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.json({success: 'successfully signed out'});
});


// TEMPORARY ROUTES *** DELETE AFTER USAGE
/*
router.get('/', ifLoggedIn, function (req, res) {
    //TEMPORARILY ALLOWING TO DISPLAY ALL USER ## DELETE AFTER USE
    User.find({}, function (err, users) {
        res.json(users);
    });

});
router.get('/d', function (req, res) {
    //TEMPORARILY ALLOWING TO DELETE ALL USER ## DELETE AFTER USE
    User.remove({}, function (err, users) {
        if (err) {
            res.json(err);
        }
        res.json({s: 'sad'});
    })
});
*/

module.exports = router;
