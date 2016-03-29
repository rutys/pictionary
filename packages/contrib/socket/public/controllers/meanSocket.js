'use strict';

/*
 angular.module('mean.socket').controller('ModalDemoCtrl', function ($scope, $uibModal, $log, $rootScope) {

 /!*    $scope.items = ['item1', 'item2', 'item3'];*!/

 $scope.animationsEnabled = true;

 $scope.open = function (size) {

 var modalInstance = $uibModal.open({
 animation: $scope.animationsEnabled,
 templateUrl: 'myModalContent.html',
 controller: 'ModalInstanceCtrl',
 size: size,
 resolve: {
 modalHeader: function () {
 return $rootScope.modalHeader;
 }
 }
 });

 modalInstance.result.then(function (selectedItem) {
 //$scope.selected = selectedItem;
 }, function () {
 $log.info('Modal dismissed at: ' + new Date());
 });
 };

 $scope.toggleAnimation = function () {
 $scope.animationsEnabled = !$scope.animationsEnabled;
 };

 });*/


angular.module('mean.socket').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, modalHeader, modalBody) {

    $scope.modalHeader = modalHeader;
    $scope.modalBody = modalBody;
    //$scope.selected = {
    //    item: $scope.items[0]
    //};
    //
    //$scope.ok = function () {
    //    $uibModalInstance.close($scope.selected.item);
    //};
    //
    //$scope.cancel = function () {
    //    $uibModalInstance.dismiss('cancel');
    //};
});

angular.module('mean.socket').controller('MeanSocketController', ['$scope', '$state', '$stateParams', 'Global', 'MeanSocket', 'MeanUser', '$interval', '$rootScope', '$uibModal',
    function ($scope, $state, $stateParams, Global, MeanSocket, MeanUser, $interval, $rootScope, $uibModal) {
        $scope.global = Global;
        $scope.package = {
            name: 'socket'
        };
        //config region
        var timeConfig = 120;
        //

        $scope.channel = $stateParams.category;
        $scope.myturn = false;
        $scope.activeUser = '';
        $scope.myword = '';
        $scope.timeleft = timeConfig;
        /*var timerObj=$('#timer');*/
        $scope.drawingTimer = null;
        $scope.gameStatus = 'readyToDraw';
        $scope.statusText = 'לחץ על כפתור התחל משחק והתחל לצייר';
        /*$scope.messages = [];
         $scope.message = '';*/
        $scope.users = [];
        $scope.modalHeader = 'modalHeader';
        $scope.modalBody = 'modalBody';

        $scope.animationsEnabled = true;

        $scope.open = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    modalHeader: function () {
                        return $scope.modalHeader;
                    },
                    modalBody: function () {
                        return $scope.modalBody;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };


        MeanSocket.on('user:channel:joined:' + $scope.channel, function (channelInfo) {
            console.log('user:joined ');
        });
        MeanSocket.on('user:disconnect:' + $scope.channel, function (user) {
            console.log('user:disconnect ');
        });

        MeanSocket.on("activeUser:disconnect:" + $scope.channel, function (user) {
            if ($state.current.name === 'Pictionary game') {
                console.log('activeUser:disconnect ');
                if (!$scope.myturn) {
                    $scope.modalHeader = "הסיבוב נגמר";
                    $scope.modalBody = "המשתמש עזב את המשחק";
                    $scope.open();
                    stopTimer();
                }
            }
        });


        //todo
        MeanSocket.on('wait:' + $scope.channel, function (word) {
            if ($state.current.name === 'Pictionary game') {
                $scope.gameStatus = "wait";
                console.log('wait');
            }
        });

        MeanSocket.on('youDraw:' + $scope.channel, function (word) {
            if ($state.current.name === 'Pictionary game') {
                $scope.myturn = true;
                $scope.myword = word;
                $scope.gameStatus = "youDraw";

                $scope.statusText = 'מילתך היא: ' + $scope.myword;

                // turn on drawing timer

                MeanSocket.emit("youDrawSuccess:" + $scope.channel, {
                    channel: $scope.channel,
                    user: MeanUser.user
                });
            }
        });

        /*        function timerTickActiveUser() {
         if ($scope.timeleft > 0) {
         $scope.timeleft--;
         } else {
         $scope.timeleft = 120;
         clearInterval($scope.drawingTimer);
         $scope.drawingTimer = null;
         $scope.gameStatus = "readyToDraw";
         }
         }*/

        function timerTick() {
            if ($state.current.name === 'Pictionary game') {
                if ($scope.timeleft > 0) {
                    var x = $scope.timeleft - 1;
                    $scope.timeleft = x;
                    /*timerObj.text($scope.timeleft);*/
                } else {
                    stopTimer();
                    //only active user emit this
                    if ($scope.myturn) {
                        MeanSocket.emit('turnFinished:' + $scope.channel, {
                            channel: $scope.channel,
                            user: MeanUser.user._id
                        });
                    }
                }
            }
        }

        function stopTimer() {
            if ($state.current.name === 'Pictionary game') {
                if (angular.isDefined($scope.drawingTimer)) {
                    $interval.cancel($scope.drawingTimer);
                    $scope.drawingTimer = undefined;
                    $scope.timeleft = timeConfig;
                }
            }
        }

        function startTimer() {
            if ($state.current.name === 'Pictionary game') {
                $scope.drawingTimer = $interval(timerTick, 1000);
            }
        }

        MeanSocket.on('friendDraw:' + $scope.channel, function (data) {
            if ($state.current.name === 'Pictionary game') {
                startTimer();
                $scope.activeUser = data.activeUser;
                if (!$scope.myturn) {
                    console.log("friend draw");
                    $scope.gameStatus = "friendDraw";
                    $scope.statusText = data.activeUser.username + ' ' + ':מצייר כעת';
                    //$scope.timeleft = data.remainingTime / 1000;
                    // turn on drawing timer
                    //$scope.drawingTimer = setInterval(timerTick, 1000);
                }
            }
        });

        MeanSocket.on('readyToDraw:' + $scope.channel, function (data) {
            if ($state.current.name === 'Pictionary game') {
                //if ($scope.myturn) {
                $scope.activeUser = '';
                $scope.gameStatus = "readyToDraw";
                $scope.statusText = 'לחץ על כפתור התחל משחק והתחל לצייר';
                $scope.myturn = false;
                //}
            }
        });

        MeanSocket.on('wordGuessed:' + $scope.channel, function (data) {
            if ($state.current.name === 'Pictionary game') {
                stopTimer();
                console.log("wordGuessed");
                if ($scope.gameStatus !== 'wait') {
                    //if user is the one who guessed
                    if (MeanUser.user._id == data.user._id) {
                        $scope.modalHeader = "כל הכבוד!";
                        $scope.modalBody = "ניחשת נכון המילה היא: " + data.word;
                        $scope.open();
                    }
                    else {
                        $scope.modalHeader = "המילה נוחשה נכון!";
                        $scope.modalBody = data.user.username + " ניחש את המילה: " + data.word;
                        $scope.open();
                    }
                }
            }
        });


        MeanSocket.on('wordNotGuessed:' + $scope.channel, function (data) {
            if ($state.current.name === 'Pictionary game') {
                if ($scope.gameStatus !== 'wait') {
                    $scope.modalHeader = "נגמר הזמן...";
                    $scope.modalBody = "המילה היתה: " + data.word;
                    $scope.open();
                    /*alert("The turn is over! The word was " + data.word);*/
                }
            }
        });

        /*        MeanSocket.on('timer:' + $scope.channel, function (data) {
         $scope.timeleft = data.countdown;

         });*/

        $scope.init = function () {
            if ($state.current.name === 'Pictionary game') {
                $scope.channel = $stateParams.category;
                //join channel
                //$scope.statusText = 'status: online';
                console.log("logged user: " + MeanUser.user.name);
                MeanSocket.emit('channel:join', {
                    channel: $scope.channel,
                    user: MeanUser.user
                });
            }
        }


        $scope.$on('$destroy', function () {
            if ($state.current.name === 'Pictionary game') {
                // Make sure that the interval is destroyed too
                stopTimer();
            }
        });

        /*        //disconnect
         //todo: emit disconnect on return page etc
         $(window).on("beforeunload", function () {
         MeanSocket.emit('disconnect');
         })*/
        /*

         $scope.socketAfterSend = function (message) {
         $scope.message = {};
         };

         $scope.socketAfterJoin = function (channel, messages) {
         $scope.channel = channel;
         $scope.messages = messages;
         };

         $scope.socketAfterGet = function (message) {
         $scope.messages.push(message);
         };

         $scope.socketAfterGetChannels = function (channels) {
         $scope.channels = channels;
         };
         */

        /*$scope.createNewChannel = function(channel) {
         $scope.activeChannel = channel;
         $scope.newChannel = '';
         };*/


        // $scope.channel = {
        // 	name: ''
        // };

        // // 			// //App info
        // // // $scope.channels = [];
        // $scope.listeningChannels = [];
        // // // $scope.activeChannel = null;
        // // // $scope.userName = $scope.global.user._id;
        // // // $scope.messages = [];

        // // // ///////////////////////////////////////////////////////////////////////
        // // // ///////////////////////////////////////////////////////////////////////
        // // // //Socket.io listeners
        // // // ///////////////////////////////////////////////////////////////////////
        // // // ///////////////////////////////////////////////////////////////////////

        // // // MeanSocket.on('channels', function channels(channels) {
        // // // 	console.log('channels', channels);

        // // // 	console.log(channels);
        // // // 	$scope.channels = channels;
        // // // 	$scope.channels = channels;
        // // // });

        // // // MeanSocket.on('message:received', function messageReceived(message) {
        // // // 	$scope.messages.push(message);
        // // // });

        // // // MeanSocket.emit('user:joined', {
        // // // 	name: $scope.global.user._id
        // // // });

        // // // MeanSocket.on('user:joined', function(user) {
        // // // 	console.log('user:joined');
        // // // 	$scope.messages.push(user);
        // // // });

        // $scope.listenChannel = function listenChannel(channel) {
        // 	MeanSocket.on('messages:channel:' + channel, function messages(messages) {
        // 		alert(channel)
        // 		MeanSocket.activeChannel = channel;
        // 		$scope.afterJoin({
        // 			messages: messages,
        // 			channel: channel
        // 		});
        // 	});

        // 	MeanSocket.on('message:channel:' + channel, function message(message) {
        // 		console.log('got message: ', message);
        // 		console.log(channel, MeanSocket.activeChannel)
        // 		if (channel === MeanSocket.activeChannel) {
        // 			$scope.meanSocketAfterGet({
        // 				message: message
        // 			});
        // 		}
        // 	});

        // 	MeanSocket.on('message:remove:channel:' + channel, function(removalInfo) {

        // 	});

        // 	if ($scope.listeningChannels.indexOf(channel) === -1)
        // 		$scope.listeningChannels.push(channel);

        // };

        // // Join

        // $scope.joinChannel = function joinChannel(channel) {
        // 	alert(channel);
        // 	//Listen to channel if we dont have it already.
        // 	if ($scope.listeningChannels.indexOf(channel) === -1) {
        // 		$scope.listenChannel(channel);
        // 	}

        // 	MeanSocket.emit('channel:join', {
        // 		channel: channel,
        // 		name: $scope.global.user._id
        // 	});
        // };

        // //Auto join the defaultChannel
        // console.log(typeof MeanSocket.activeChannel)
        // if (typeof MeanSocket.activeChannel === 'undefined')
        // 	$scope.joinChannel('mean');

        // // $scope.$watch('joinToChannel', function() {
        // // 	if ($scope.joinToChannel)
        // // 		$scope.joinChannel($scope.joinToChannel);
        // // });
    }
]);
