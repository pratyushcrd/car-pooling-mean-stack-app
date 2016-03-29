/**
 * Created by Pratyush on 28-03-2016.
 */
var User = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-node');

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};

module.exports = {

    deserialize: function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(err, user);
        })
    },

    serialize: function (user, done) {
        done(null, user._id);
    },

    strategyLogin: new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        function (req, username, password, done) {
            User.findOne({'email': username},
                function (err, user) {
                    if (err)
                        return done('username or password incorrect', false);
                    if (!user) {
                        return done('username or password incorrect', false);
                    }
                    if (!isValidPassword(user, password)) {
                        return done('username or password incorrect', false);
                    }
                    req.user = user;
                    return done(null, user);
                }
            );
        }),

    strategyRegister: new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            findOrCreateUser = function () {
                User.findOne({'username': username}, function (err, user) {
                    if (err) {
                        console.log('Error in sign up: ' + err);
                        return done(err);
                    }
                    if (user) {


                        return done({
                            message: 'User already exists'
                        }, false);
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.body.email;
                        newUser.gender = req.body.gender;
                        newUser.age = req.body.age;

                        newUser.save(function (err, user) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                return done(err, false);
                            } else {
                                req.user = user;
                                console.log('User Registration succesfull');
                                return done(null, newUser);
                            }
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })


};