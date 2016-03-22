'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
