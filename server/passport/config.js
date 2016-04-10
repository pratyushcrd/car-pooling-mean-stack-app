var User = require('../models/user.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var bCrypt = require('bcrypt-node');
var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
};
module.exports = {
    deserialize: function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        })
    },
    serialize: function(user, done) {
        done(null, user._id);
    },
    facebookStrategy: new FacebookStrategy({
        clientID: '1528040984167334',
        clientSecret: '00b4a6e7f4eb3e73adbd87482e0d278b',
        callbackURL: "http://localhost:3000/users/facebook/callback",
        profileFields: ['id', 'displayName', 'picture', 'email', 'gender', 'about', 'bio']
    }, function(accessToken, refreshToken, profile, cb) {
        console.log('Enter strategy');
        console.log(cb);
        profile._json = undefined;
        profile._raw = undefined;
        return cb(profile);
    })
};