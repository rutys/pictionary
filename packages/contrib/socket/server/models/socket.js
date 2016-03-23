'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */

var MessageSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  channel: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date
  },
  expires: {
    type: Number
  }
});

mongoose.model('Message', MessageSchema);

/**
 * Line Schema
 */
var LineSchema = new Schema({
  from: {
    x:Number,
    y:Number
  },
  to: {
    x:Number,
    y:Number
  },
  color: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },

});
mongoose.model('Line', LineSchema);

/**
 * Channel Schema
 */
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
    word:{
        type: String,
    },
    words:{
        type:[String],
        required: true
    }

});
mongoose.model('Channel', ChannelSchema);
