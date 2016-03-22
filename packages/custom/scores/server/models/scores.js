/*
'use strict';

/!**
 * Module dependencies.
 *!/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/!**
 * Channel Schema
 *!/
var ChannelSchema = new Schema({
    channel: {
        type: String,
        required: true
    },
    activeUser: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    startTime: {
        type: Date
    },
    word: {
        type: String,
    },
    words: {
        type: [String],
        required: true
    }

});
mongoose.model('Channel', ChannelSchema);
*/
