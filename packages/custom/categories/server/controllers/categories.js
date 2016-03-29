'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    Line = mongoose.model('Line'),
    User = mongoose.model('User'),
    Category = mongoose.model('Channel'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');


exports.all = function (req, res) {

    Category.find().sort('channel').exec(function (err, categories) {
        console.log(categories);
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the categories'
            });
        }

        res.jsonp(categories)
    });

};

exports.initDB = function () {
    User.remove({}, function(){});
    Line.remove({}, function(){});
    Message.remove({}, function(){});

    Category.remove({}, function(){
        var channel = new Category();
        channel.channel = "עצמים";
        channel.words = ["תפוח", "שולחן", "מלפפון", "מנורה", "ילד"];
        channel.word = undefined;
        channel.startTime = undefined;
        channel.activeUser = undefined;
        channel.save(function (err) {

        });

        var channel = new Category();
        channel.channel = "ביטויים";
        channel.words = ["התפוח לא נופל רחוק מן העץ", "חתול בשק", "מרוב עצים לא רואים את היער", " הקש ששבר את גב הגמל", "אזניים לכותל", "טובים השניים מן האחד"];
        channel.word = undefined;
        channel.startTime = undefined;
        channel.activeUser = undefined;
        channel.save(function (err) {
            /*if (err) console.log(err);
             Channel.findOne({
             _id: channel._id
             }).exec(function(err, channel) {
             return channel;
             });*/
        });

        var channel = new Category();
        channel.channel = "פעלים";
        channel.words = ["לשתות", "לאכול", "לעוף", "לרקוד", "ללכת"];
        channel.word = undefined;
        channel.startTime = undefined;
        channel.activeUser = undefined;
        channel.save(function (err) {
            /*if (err) console.log(err);
             Channel.findOne({
             _id: channel._id
             }).exec(function(err, channel) {
             return channel;
             });*/
        });
    });

};

