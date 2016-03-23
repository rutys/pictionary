'use strict';

// The Package is past automatically as first parameter
module.exports = function (MeanSocket, io) {

    var _ = require('lodash');
    var moment = require('moment');
    var mycontroller = require('../controllers/sockets');


    io.on('connection', function (socket) {

        console.log('Chat - user connected');
        //mycontroller.checkinit();

        /**
         * disconnect
         */
        function disconnectFromGame(){
            //get user by socketid- get channel- user:disconnect: logic
            console.log('Chat - user disconnected');
            mycontroller.disconnectUser({socketId: socket.id}, function (user) {
                console.log('user:disconnect: ' + user.channel);
                //check if user is active
                mycontroller.getActiveGame(user.channel, function (data) {
                    console.log('got active user ' + data.activeUser + " useddisconect id: " + user._id + 'firstCon: ' + (data.activeUser !== undefined));
                    //console.log('2 con: '+(data.activeUser._id == user._id));
                    //console.log('full con: ' + (data.activeUser !== undefined && data.activeUser._id === user._id));
                    if (data.activeUser !== undefined && data.activeUser._id.toString() === user._id.toString()) {
                        mycontroller.clearActiveGame(user.channel, function (removedChannel) {
                            {
                                console.log('removedChannel activeUser:disconnect' + removedChannel);
                                io.sockets.emit("activeUser:disconnect:" + user.channel, user);
                                io.sockets.emit('clearCanvas:' + user.channel);
                                io.sockets.emit('clearMessages:' + user.channel);
                                console.log('readyToDraw' + user.channel);
                                io.sockets.emit('readyToDraw:' + user.channel);
                            }
                        });
                    }
                    console.log('io.sockets emit user:disconnect: ' + user.channel);
                    io.sockets.emit('user:disconnect:' + user.channel, user);
                    //Emit back users
                    mycontroller.getUsersForSocket(user.channel, function (data) {
                        console.log('got users');
                        io.sockets.emit('users:channel:' + user.channel, data);
                    });
                });
            });
        }

        //called when changing states out of the game state
        socket.on('disconnectFromGame', function () {
            disconnectFromGame();
        });

        //called automatic on disconnection of session
        socket.on('disconnect', function () {
            disconnectFromGame();
        });

        /*        /!**
         * user:joined
         *!/
         socket.on('user:joined', function (user) {
         console.log(user.name + ' joined the room');
         var message = user.name + ' joined the room';
         io.emit('user:joined', {
         message: message,
         time: moment(),
         expires: moment().add(10)
         });
         });*/


        /**
         * message:send
         */
        socket.on('message:send', function (message) {
            console.log('message: ' + message);
            console.log(JSON.stringify(message));

            console.log('storing to set: messages:' + message.channel);

            mycontroller.createFromSocket(message, function (cb) {
                io.emit('message:channel:' + message.channel, cb);
                console.log('emited: ' + cb);
            });

            // check if current word was guessed

            mycontroller.getActiveGame(message.channel, function (data) {
                if (data.activeUser != undefined && data.activeUser._id != message.user._id)
                    if (message.message.toLowerCase().trim() == data.word.toLowerCase()) {
                        console.log('wordGuessed');
                        io.sockets.emit('wordGuessed:' + message.channel, {word: data.word, user: message.user});


                        // add scores to guesser and drawer
                        mycontroller.addScores({
                            channel: message.channel,
                            activeUser: data.activeUser,
                            userGuessed: message.user,
                            timePass: data.timePass
                        }, function () {
                            mycontroller.clearActiveGame(message.channel, function (data) {
                                //Emit back users
                                mycontroller.getUsersForSocket(message.channel, function (data) {
                                    console.log('got users');
                                    io.sockets.emit('users:channel:' + message.channel, data);
                                });
                                console.log('wordGuessed turnFinished channel cleared: ' + data + " channel:" + message.channel);
                                io.sockets.emit('clearCanvas:' + message.channel);
                                io.sockets.emit('clearMessages:' + message.channel);
                                io.sockets.emit('readyToDraw:' + message.channel);
                            });
                        });
                    }
            });
        });


        /**
         * channel:join
         */
        socket.on('channel:join', function (channelInfo) {
            //mycontroller.clearActiveGame(channelInfo.channel);

            console.log('Channel joined - ', channelInfo.channel);
            console.log("user: " + channelInfo.user);
            console.log('Added to channels: ', channelInfo.channel);
            console.log('messages:' + channelInfo.channel);

            /*            if (channelWatchList.indexOf(channelInfo.channel) === -1) {
             channelWatchList.push(channelInfo.channel);
             }*/
            console.log('updateJoinedUser:' + socket.id);
            mycontroller.updateJoinedUser({
                channel: channelInfo.channel,
                user: channelInfo.user,
                socketId: socket.id
            }, function () {
                //Emit back users
                mycontroller.getUsersForSocket(channelInfo.channel, function (data) {
                    console.log('got users');
                    io.sockets.emit('users:channel:' + channelInfo.channel, data);
                });
            });

            //todo:check if user is already playing-has a channel defined

            /*            //user disconnect
             socket.on('user:disconnect:' + channelInfo.channel, function (channelInfo) {
             //todo: update users list
             console.log('user:disconnect: ' + channelInfo.channel);
             //check if user is active
             mycontroller.getActiveGame(channelInfo.channel, function (data) {
             console.log('got active user ' + data.activeUser + " useddisconect id: " + channelInfo.user._id + 'firstCon: ' + (data.activeUser !== undefined));
             //console.log('2 con: '+(data.activeUser._id == channelInfo.user._id));
             console.log('full con: ' + (data.activeUser != undefined && data.activeUser._id == channelInfo.user._id));
             if (data.activeUser != undefined && data.activeUser._id == channelInfo.user._id) {
             mycontroller.clearActiveGame(channelInfo.channel, function (removedChannel) {
             {
             console.log('removedChannel activeUser:disconnect' + removedChannel);
             io.sockets.emit("activeUser:disconnect:" + channelInfo.channel, channelInfo.user);
             io.sockets.emit('clearCanvas:' + channelInfo.channel);
             io.sockets.emit('clearMessages:' + channelInfo.channel);
             console.log('readyToDraw' + channelInfo.channel);
             io.sockets.emit('readyToDraw:' + channelInfo.channel);
             }
             });
             }
             console.log('io.sockets emit user:disconnect: ' + channelInfo.channel);
             io.sockets.emit('user:disconnect:' + channelInfo.channel, channelInfo.user);
             });
             });*/

            io.emit('user:channel:joined:' + channelInfo.channel, {
                //channelInfo: channelInfo,
            });

            /*            mycontroller.getListOfChannels(function (channels) {
             _.each(channels, function (c) {
             if (channelWatchList.indexOf(c) === -1) {
             channelWatchList.push(c);
             }
             });
             console.log('Emitting2', 'channels', channelWatchList);
             socket.emit('channels', channelWatchList);
             });*/

            //Emit back any messages that havent expired yet.
            mycontroller.getAllForSocket(channelInfo.channel, function (data) {
                console.log('got messages');
                socket.emit('messages:channel:' + channelInfo.channel, data);
            });


            //canvas draw
            mycontroller.getLinesForSocket(channelInfo.channel, function (data) {
                console.log('got canvas');
                socket.emit('drawCanvas:channel:' + channelInfo.channel, data);
            });

            //line draw
            socket.on('draw:channel:' + channelInfo.channel, function (line) {
                console.log('line: ' + line);
                console.log(JSON.stringify(line));

                //console.log('storing to set: lines:' + line.channel);

                mycontroller.createLineFromSocket(line, function (cb) {
                    io.emit('draw:channel:' + line.channel, cb);
                    console.log('emited: ' + cb);
                });
            });

            socket.on('clearCanvas:' + channelInfo.channel, function (channel) {
                //if(currentPlayer == socket.id) {
                console.log('clearCanvas ' + channel);
                mycontroller.clearCanvasForSocket(channel, function (data) {
                    io.sockets.emit('clearCanvas:' + channel);
                });
            });

            // notify if someone is drawing
            mycontroller.getActiveGame(channelInfo.channel, function (data) {
                console.log('someone is drawing - got active user ' + data.activeUser + " time: " + data.remainingTime / 1000);
                console.log();
                if (data.activeUser != undefined) {
                    console.log('wait: emit' + channelInfo.channel);
                    socket.emit('wait:' + channelInfo.channel, data);
                }
            });

            //logic

            socket.on('readyToDraw:' + channelInfo.channel, function (channelInfo) {
                console.log("checkinside 1 " + channelInfo.channel, channelInfo.user);
                mycontroller.getActiveGame(channelInfo.channel, function (data) {
                    console.log('got active user ' + data.activeUser);
                    console.log("checkinside 2 " + channelInfo.channel, channelInfo.user);
                    console.log('!data.activeUser' + !data.activeUser);
                    if (data.activeUser === undefined)
                        mycontroller.saveActiveGame({
                            channelInfo: channelInfo,
                            socket: socket
                        }, function (data) {
                            console.log('saved active user ' + data + " to: " + channelInfo.channel);
                            mycontroller.clearCanvasForSocket(channelInfo.channel, function () {
                                console.log("checkinside 3 " + channelInfo.channel, channelInfo.user);
                                io.sockets.emit('clearCanvas:' + channelInfo.channel);
                                socket.emit('youDraw:' + channelInfo.channel, data.word);
                            });
                        });
                });

            });

            /*
             var countDown;
             //var x;*/

            socket.on('youDrawSuccess:' + channelInfo.channel, function (channelInfo) {
                io.sockets.emit('friendDraw:' + channelInfo.channel, {
                    activeUser: channelInfo.user
                });
                console.log('youDrawSuccess');
                /* // set the timer for 2 minutes (120000ms)
                 var x = setInterval(function () {
                 mycontroller.getCountDown(channelInfo.channel, function (data) {
                 countDown = data;
                 timerTick(countDown);
                 io.sockets.emit('timer:' + channelInfo.channel, {countdown: countDown});
                 mycontroller.setCountDown(channelInfo.channel, countDown);
                 });
                 }, 1000);
                 console.log('setTimer from routes' + x);
                 mycontroller.setTimer(channelInfo.channel, {timer: x});*/
                //setTimeout(socket.emit("turnFinished:" + channelInfo.channel, channelInfo.channel), 120000);
            });

            /*            function timerTick() {
             if (countDown > 0) {
             countDown--;
             } else {
             mycontroller.clearActiveGame(channelInfo.channel, function (data) {
             console.log('turnFinished channel cleared: ' + data);
             io.sockets.emit('wordNotGuessed:' + channelInfo.channel, {word: data.word});
             io.sockets.emit('clearCanvas:' + channel);
             io.sockets.emit('clearMessages:' + channel);
             io.sockets.emit('readyToDraw:' + channelInfo.channel);
             });
             }
             }*/


            socket.on("turnFinished:" + channelInfo.channel, function (channelInfo) {
                mycontroller.clearActiveGame(channelInfo.channel, function (data) {
                    console.log('turnFinished channel cleared: ' + data);


                    io.sockets.emit('wordNotGuessed:' + channelInfo.channel, {word: data.word});
                    // dec scores to drawer
                    mycontroller.subScores({activeUser: data.activeUser}, function () {
                        mycontroller.getUsersForSocket(channelInfo.channel, function (data) {
                            console.log('got users');
                            io.sockets.emit('users:channel:' + channelInfo.channel, data);
                        });
                    });
                    io.sockets.emit('clearCanvas:' + channelInfo.channel);
                    io.sockets.emit('clearMessages:' + channelInfo.channel);
                    io.sockets.emit('readyToDraw:' + channelInfo.channel);


                });
            });


        });

    });
};


