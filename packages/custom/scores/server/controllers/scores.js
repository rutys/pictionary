'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');


exports.all = function (req, res) {

    User.find().sort('score').exec(function (err, users) {
        console.log(users);
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the users'
            });
        }

        res.jsonp(users)
    });

};

