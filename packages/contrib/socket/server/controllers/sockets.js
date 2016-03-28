'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    Line = mongoose.model('Line'),
    Channel = mongoose.model('Channel'),
    User = mongoose.model('User'),
    _ = require('lodash');

//config vars
var scoreIGuessed = 100;
var scoreMyWordGuessed = 1000;
var scoreMyWordNotGuessed = -100;
var gameTime = 120;
var prevword="";
//

function clearCanvasForSocket(channel, cb) {
    console.log("clearCanvasForSocket channel:" + channel);
    Line.remove({
        channel: channel
    }).exec(function (err) {
        console.log("clear canvas");
        return cb();
    });
};
exports.clearCanvasForSocket = clearCanvasForSocket;

function clearMessages(channel, cb) {
    console.log("clearMessages channel:" + channel);
    Message.remove({
        channel: channel
    }).exec(function (err) {
        console.log("clear Messages");
        return cb();
    });
};
exports.clearMessages = clearMessages;

exports.createFromSocket = function (data, cb) {
    console.log("create msg " + data.message);
    var message = new Message(data);
    message.user = data.user._id;
    message.time = new Date();
    message.save(function (err) {
        if (err) console.log("couldnt save " + err);
        console.log("saved");
        Message.findOne({
            _id: message._id
        }).populate('user', 'name username').exec(function (err, message) {
            return cb(message);
        });
    });
};

exports.getAllForSocket = function (channel, cb) {
    Message.find({
        channel: channel
    }).sort('time').populate('user', 'name username').exec(function (err, messages) {
        return cb(messages);
    });
};


exports.getUsersForSocket = function (channel, cb) {
    User.find({
        channel: channel
    }).sort('score').exec(function (err, users) {
        return cb(users);
    });
};

exports.getListOfChannels = function (cb) {
    Message.distinct('channel', {}, function (err, channels) {
        console.log('channels', channels);
        return cb(channels);
    });
};

exports.createLineFromSocket = function (data, cb) {
    //console.log("from createLineFromSocket: " + data);
    var line = new Line(data);
    line.save(function (err) {
        if (err) console.log(err);
        Line.findOne({
            _id: line._id
        }).exec(function (err, line) {
            return cb(line);
        });
    });
};

exports.getLinesForSocket = function (channel, cb) {
    Line.find({
        channel: channel
    }).exec(function (err, line) {
        return cb(line);
    });
};

exports.getActiveGame = function (channel, cb) {
    Channel.findOne({
        channel: channel
    }).populate('activeUser', 'name username').exec(function (err, data) {
        if (data.activeUser) {

            console.log("channel.activeUser: " + data.activeUser);
            console.log("channel.startTime: " + data.startTime);
            var timePass = Math.round((new Date() - data.startTime) / 1000);
            console.log("timePass time: " + timePass);
            return cb({activeUser: data.activeUser, timePass: timePass, word: data.word});
        }
        else {
            console.log("not active");
            return cb({activeUser: data.activeUser});
        }
    });
};

exports.disconnectUser = function (data, cb) {
    console.log("disconnectUser socketId:" + data.socketId);
    User.findOne({socketId: data.socketId}).exec(function (err, user) {
        if (user) {
            var temp = new User(user);
            user.channel = '';
            user.socketId = -1;
            user.save(function (err) {
                if (err)
                    console.log(err);
                console.log("user:" + user + "  temp:" + temp);
                return cb(temp);
            });
        }
        else
            console.log("user not found of socketId:" + data.socketId);
    });

};

exports.clearActiveGame = function (channel, cb) {
    console.log("from clearActiveUserForSocket: channel" + channel);
    clearCanvasForSocket(channel, function () {
        clearMessages(channel, function () {
            Channel.findOne({channel: channel}).populate('activeUser', 'name username').exec(function (err, channel) {
                console.log("from clearActiveUserForSocket: channel" + channel.channel);
                // var activeUser;
                var temp = new Channel();
                temp.channel = channel.channel;
                temp.words = channel.words;
                /*var x = channel.timer;
                 console.log("timer to remove " + JSON.stringify(x) + " or " + x);
                 clearInterval(x);
                 temp.timer = 0;
                 temp.countDown = 120;*/
                temp.activeSocket = undefined;
                //activeUser=temp.activeUser;
                //console.log("from clearActiveUserForSocket1: channel.activeUser: " + activeUser);
                temp.activeUser = undefined;
                temp.startTime = undefined;
                channel.remove(function (err, removed) {
                    temp.save(function (err) {
                        if (err)
                            console.log(err);
                        //console.log("from clearActiveUserForSocket2: channel.activeUser: " + activeUser);
                        //return cb(activeUser);


                        return cb(removed);

                    });
                });
            });
        });
    });
};

exports.getActiveSocket = function (channel, cb) {
    Channel.findOne({
        channel: channel
    }, 'activeSocket').exec(function (err, data) {
        console.log("channel.activeSocket: " + data);
        return cb(data);
    });
};

function randomizeWord(array) {
    return array[Math.floor(Math.random() * array.length)];
}

exports.saveActiveGame = function (data, cb) {
    Channel.findOne({channel: data.channelInfo.channel}, function (err, channel) {
        console.log("from saveActiveUserForSocket: channel" + channel.channel + channel.words);
        var temp = new Channel();
        temp.channel = channel.channel;
        temp.words = channel.words;
        temp.activeSocket = data.socket;
        temp.activeUser = data.channelInfo.user;
        temp.startTime = new Date();
        temp.word = randomizeWord(channel.words);
        console.log("prev word: "+prevword +"rand word 1 "+temp.word);
        if(prevword==temp.word){
            temp.word = randomizeWord(channel.words);
            console.log("rand word 2 "+temp.word);
        }
        prevword=temp.word;
        channel.remove(function () {
            temp.save(function (err) {
                if (err) console.log(err);
                Channel.findOne({
                    channel: data.channelInfo.channel
                }).select('activeUser startTime word').populate('activeUser', 'name username').exec(function (err, data) {
                    console.log("from saveActiveUserForSocket: channel.activeUser: " + data.activeUser);
                    console.log("channel.startTime: " + data.startTime);
                    console.log('rand word: ' + data.word);
                    return cb({activeUser: data.activeUser, word: data.word});
                });
            });
        });
    });
};

exports.updateJoinedUser = function (data, cb) {
    User.findById(data.user._id, function (err, doc) {
        if (!doc)
          return;
        doc.socketId = data.socketId;
        doc.channel = data.channel;

        doc.save(function (err) {
            if (err) console.log(err);
            console.log('updateJoinedUser ' + doc);
            return cb();
        });
    });
};


exports.addScores = function (data, cb) {
    var scoresByTime = gameTime - data.timePass;
    console.log("scoresByTime:" + scoresByTime);

    //add scores to guessed user
    User.findById(data.userGuessed._id, function (err, doc) {
        doc.score = doc.score + scoresByTime + scoreIGuessed;

        doc.save(function (err) {
            if (err) console.log(err);
            console.log('addScores guessed user ' + doc.score);

            //add scores to active user
            User.findById(data.activeUser._id, function (err, doc) {
                doc.score = doc.score + scoresByTime + scoreMyWordGuessed;

                doc.save(function (err) {
                    if (err) console.log(err);
                    console.log('addScores activeUser ' + doc.score);
                    return cb();
                });
            });
        });
    });
};


exports.subScores = function (data, cb) {
    //sub scores to active user
    User.findById(data.activeUser._id, function (err, doc) {
        if((doc.score+ scoreMyWordNotGuessed)>=0){
            doc.score = doc.score + scoreMyWordNotGuessed;
            console.log("sub scores");
    }
        else {
            console.log("less than 0 not sub scores");
        }

        doc.save(function (err) {
            if (err) console.log(err);
            console.log('subScores active user ' + doc.score);
            return cb();
        });
    });
};

/*

 exports.setTimer = function (channel, data) {

 Channel.findOne({channel: channel}, function (err, doc) {
 doc.timer = data.timer;
 console.log('setTimer ' + data.timer);
 doc.save();
 });
 };

 exports.getCountDown = function (channel, cb) {
 Channel.findOne({channel: channel}, function (err, doc) {
 console.log('getCountDown ' + doc.countDown);
 return cb(doc.countDown);
 });
 };

 exports.setCountDown = function (channel, countDown) {
 Channel.findOne({channel: channel}, function (err, doc) {
 doc.countDown = countDown;
 console.log('setCountDown ' + doc.countDown);
 doc.save();
 });
 };
 */


exports.checkinit = function () {
    var channel = new Channel();
    channel.channel = "עצמים";
    channel.words = ["תפוח", "שולחן", "מלפפון", "מנורה", "ילד"];
    channel.word = undefined;
    channel.startTime = undefined;
    channel.activeUser = undefined;
    channel.save(function (err) {

    });

    var channel = new Channel();
    channel.channel = "פתגמים";
    channel.words = ["התפוח לא נופל רחוק מן העץ", "חתול בשק", "מרוב עצים לא רואים את היער", " הקש ששבר את גב הגמל", "אזניים לכותל"];
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
};
