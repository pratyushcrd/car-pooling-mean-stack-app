var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat');
var Journey = require('../models/journey');

var ifLoggedIn = function (req, res, next) {
    if (req.user) {
        return next();
    }
    res.json({
        error: 'Not logged in'
    });
};

router.get('/:jid', ifLoggedIn, function (req, res, next) {
    Chat.find({journeyId: req.params.jid}, function (err, messages) {
        if (err) {
            return res.send({error: err});
        }
        res.send(messages);
    }).sort({created_at: -1});
});

router.post('/:jid', ifLoggedIn, function (req, res, next) {
    Journey.findOne({_id: req.params.jid}, function (err, journey) {
        if (err || !journey) {
            return res.json({error: "Journey dose not exists"});
        }
        else {
            var flag = 0;
            for (index in req.user.journeys) {
                var userJourney = req.user.journeys[index];
                console.log(userJourney);
                console.log(req.params.jid);
                if (userJourney == req.params.jid) {
                    flag = 1;
                }
            }
            if (flag == 1) {
                var newMessage = new Chat();
                newMessage.message = req.body.message;
                newMessage.userId = req.user._id;
                newMessage.journeyId = req.params.jid;
                newMessage.save(function (err, Message) {
                    if (err) {
                        return res.send({error: err});

                    }
                    return res.send(Message);
                });
            }
            else {
                return res.send({error: "You are not authorized"});
            }

        }


    });


});


module.exports = router;