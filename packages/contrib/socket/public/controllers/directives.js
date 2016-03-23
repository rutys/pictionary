'use strict'; //fix for safari

/*
angular.module('mean.socket').directive('meanSocket', function ($stateParams, Global, MeanSocket, MeanUser) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            message: '=',
            afterSend: '&'
        },
        templateUrl: 'socket/views/directive.html',
        link: function (scope, elm, attr) {
            console.log(scope.message);

            scope.global = Global;
            scope.channel =$stateParams.category;
            // // ///////////////////////////////////////////////////////////////////////
            // // ///////////////////////////////////////////////////////////////////////
            // // // Controller methods
            // // ///////////////////////////////////////////////////////////////////////
            // // ///////////////////////////////////////////////////////////////////////

            scope.sendMessage = function (message) {
                if (!message || message === null || typeof message === 'undefined' || message.length === 0) {
                    return;
                }
                MeanSocket.emit('message:send', {
                    message: message.message,
                    user: MeanUser.user._id,
                    channel: scope.channel
                });
                scope.afterSend({
                    message: message
                });
            };

        }
    };
});
*/


/*angular.module('mean.socket').directive('useMeanSocket', function (Global, MeanSocket, $stateParams, MeanUser) {
    return {
        restrict: 'E',
        scope: {
            joinToChannel: '=',
            afterJoin: '&',
            meanSocketAfterGet: '&',
            meanSocketAfterGetAllChannels: '&'
        },
        link: function (scope, elm, attr) {

            scope.global = Global;

            scope.channel =$stateParams.category;

            // 			// //App info
            // // $scope.channels = [];
            //scope.listeningChannels = [];
            // // $scope.activeChannel = null;
            // // $scope.userName = $scope.global.user._id;
            // // $scope.messages = [];

            // // ///////////////////////////////////////////////////////////////////////
            // // ///////////////////////////////////////////////////////////////////////
            // // //Socket.io listeners
            // // ///////////////////////////////////////////////////////////////////////
            // // ///////////////////////////////////////////////////////////////////////

/!*            MeanSocket.on('channels', function (channels) {
                scope.meanSocketAfterGetAllChannels({
                    channels: channels
                });
            });*!/

            // // MeanSocket.on('message:received', function messageReceived(message) {
            // // 	$scope.messages.push(message);
            // // });

/!*            MeanSocket.emit('user:joined', {
                user: MeanUser.user._id
            });

            MeanSocket.on('user:joined', function (user) {
                // scope.meanSocketAfterGet({
                // 	message: user
                // });
            });*!/

/!*            scope.listenChannel = function listenChannel(channel) {
                MeanSocket.on('user:channel:joined:' + channel, function (user) {
                    console.log('user:joined', channel);
                    // scope.meanSocketAfterGet({
                    // 	message: user
                    // });
                });

                MeanSocket.on('messages:channel:' + channel, function (messages) {
                    //MeanSocket.channel = channel;
                    scope.afterJoin({
                        messages: messages,
                        channel: channel
                    });
                });

                MeanSocket.on('message:channel:' + channel, function (message) {
                    if (channel === scope.channel) {
                        scope.meanSocketAfterGet({
                            message: message
                        });
                    }
                });

                MeanSocket.on('message:remove:channel:' + channel, function (removalInfo) {

                });

                if (scope.listeningChannels.indexOf(channel) === -1)
                    scope.listeningChannels.push(channel);

            };*!/

            // Join

            scope.joinChannel = function joinChannel(channel) {
                /!*!//Listen to channel if we dont have it already.
                if (scope.listeningChannels.indexOf(channel) === -1) {
                    scope.listenChannel(channel);
                }*!/

                MeanSocket.emit('channel:join', {
                    channel: channel,
                    user: MeanUser.user._id
                });

                MeanSocket.on('user:channel:joined:' + channel, function (channelInfo) {
                    console.log('user:joined ' +channelInfo.channel+" "+channelInfo.user);

                });

                MeanSocket.on('messages:channel:' + channel, function (messages) {
                    //MeanSocket.channel = channel;
                    scope.afterJoin({
                        messages: messages,
                        channel: channel
                    });
                });

                MeanSocket.on('message:channel:' + channel, function (message) {
                    if (channel === scope.channel) {
                        scope.meanSocketAfterGet({
                            message: message
                        });
                    }
                });
            };

            //Auto join the chosenChannel
            scope.joinChannel(scope.channel);

            //scope.$watch('joinToChannel', function () {
            //    console.log('scope.joinToChannel:', scope.joinToChannel);
            //    if (scope.joinToChannel)
            //        scope.joinChannel(scope.joinToChannel);
            //});


        }
    };
});*/

// ================================================
//                           canvas drawing section
// ================================================
angular.module('mean.socket').directive('ngWidth', function() {
    return function(scope, elem, attrs) {
        attrs.$observe('ngWidth', function(width) {
            elem.attr('width', width);
        });
    };
});
angular.module('mean.socket').directive('ngHeight', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngHeight', function(height) {
                elem.attr('height', height);
            });
        };
    });
angular.module('mean.socket').directive('pictionaryCanvas', function (Global, MeanSocket, $stateParams, MeanUser) {
    return {
        restrict: 'EA',
        scope: {
            myturn:'=',
            /*gamestatus:'@',*/
            timeleft:'='
        },
        templateUrl: 'socket/views/pictionaryCanvas.html',
        link: function (scope, elm, attr) {




            var canvas = $('#pictionaryCanvas');
            //clearcanvas = $('#clearcanvas'),
            //clearchat = $('#clearchat'),
            //selectedcolor = $('.color'),
            var context = canvas[0].getContext('2d');
            var lastpoint = null;
            scope.painting = false;
            scope.user=MeanUser.user;
            scope.channel=$stateParams.category;
            scope.chosenColor="#000000";
            scope.erase=false;

            //cursor
            /*canvas.mouseout(function(){
                $('#cursor').hide();
            });*/
            /*canvas.mouseenter(function(){
                $('#cursor').show();
            });*/
           /* canvas.mousemove(function(e){
                $('#cursor').css('left', e.clientX - document.getElementById('pictionaryCanvas').getBoundingClientRect().left).css('top', e.clientY - document.getElementById('pictionaryCanvas').getBoundingClientRect().top);
            });*/
            //
            scope.myCursor=function(){
                if(!scope.myturn)
                    return "notActiveCanvas";
                return scope.erase? "activeCanvasErase":'activeCanvas';
            }

            MeanSocket.on('draw:channel:'+scope.channel, draw);

           //init height and width of canvas
            var canvas2 = document.getElementById('pictionaryCanvas');
            var style = window.getComputedStyle(canvas2, null);
            canvas2.width=parseInt(style.getPropertyValue("width"), 10);
            canvas2.height=parseInt(style.getPropertyValue("height"), 10);
            /*  draw({from: {x: 0, y: 0} , to: {x: 5, y:5}, color: "#000000"/!*selectedcolor.val()*!/, channel:scope.channel});
            //*/


         /*   scope.getWidth= function getWidth(){
                var canvas2 = document.getElementById('pictionaryCanvas');
                var style = window.getComputedStyle(canvas2, null);
                return canvas2.width=parseInt(style.getPropertyValue("width"), 10);
            }

            scope.getHeight= function getHeight(){
                var canvas2 = document.getElementById('pictionaryCanvas');
                var style = window.getComputedStyle(canvas2, null);
                return canvas2.height=parseInt(style.getPropertyValue("height"), 10);
            }*/

            function draw(line) {
                context.lineJoin = 'round';
                context.lineWidth = 2;
                context.strokeStyle = line.color;
                context.beginPath();

                if (line.from) {
                    context.moveTo(line.from.x, line.from.y);
                } else {
                    context.moveTo(line.to.x - 1, line.to.y);
                }

                context.lineTo(line.to.x, line.to.y);
                context.closePath();
                context.stroke();
            }

            // Disable text selection on the canvas
            canvas.mousedown(function () {
                return false;
            });

            canvas.mousedown(function (e) {
                if (scope.myturn) {
                    scope.painting = true;
                    var newpoint = {x: e.clientX - document.getElementById('pictionaryCanvas').getBoundingClientRect().left, y: e.clientY - document.getElementById('pictionaryCanvas').getBoundingClientRect().top};
                    var color=scope.erase?"#ffffff":scope.chosenColor;
                    var line = {from: null, to: newpoint, color:color , channel:scope.channel};
                    draw(line);
                    lastpoint = newpoint;
                    MeanSocket.emit('draw:channel:'+scope.channel, line);
                }
            });

            canvas.mousemove(function (e) {
                if (scope.myturn && scope.painting) {
                    var newpoint = {x: e.clientX - document.getElementById('pictionaryCanvas').getBoundingClientRect().left, y: e.clientY - document.getElementById('pictionaryCanvas').getBoundingClientRect().top};
                    var color=scope.erase?"#ffffff":scope.chosenColor;
                    var line = {from: lastpoint, to: newpoint, color: color, channel:scope.channel};

                    draw(line);
                    lastpoint = newpoint;
                    MeanSocket.emit('draw:channel:'+scope.channel, line);
                }
                //$('#cursor').css('left', e.clientX+5 - document.getElementById('pictionaryCanvas').getBoundingClientRect().left).css('top', e.clientY +5- document.getElementById('pictionaryCanvas').getBoundingClientRect().top);
            });

            canvas.mouseout(function (e) {
                scope.painting = false;
                //$('#cursor').hide();
            });

            canvas.mouseup(function (e) {
                scope.painting = false;
            });

            MeanSocket.on('drawCanvas:channel:'+scope.channel, function (canvasToDraw) {
                if (canvasToDraw) {
                    canvas.width(canvas.width());
                    context.lineJoin = 'round';
                    context.lineWidth = 2;

                    for (var i = 0; i < canvasToDraw.length; i++) {
                        var line = canvasToDraw[i];
                        context.strokeStyle = line.color;
                        context.beginPath();
                        if (line.from) {
                            context.moveTo(line.from.x, line.from.y);
                        } else {
                            context.moveTo(line.to.x - 1, line.to.y);
                        }
                        context.lineTo(line.to.x, line.to.y);
                        context.closePath();
                        context.stroke();
                    }
                }
            });

            scope.clearCanvas=function () {
                if (scope.myturn) {
                    MeanSocket.emit('clearCanvas:'+scope.channel, scope.channel);
                }
            };

            MeanSocket.on('clearCanvas:'+scope.channel, function () {
                context.clearRect (0, 0, canvas.width(), canvas.height());
            });


            scope.readyToDraw = function () {
                MeanSocket.emit('readyToDraw:' + scope.channel, {
                    channel: scope.channel,
                    user: scope.user._id
                });
            }


        }
    };
});



// ================================================
//                           timer
// ================================================
/*
angular.module('mean.socket').directive('timer', function (Global, MeanSocket) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: 'socket/views/timer.html',
        link: function (scope, elm, attr) {


        }
    };
});
*/

