'use strict';
// ================================================
//                           users
// ================================================
angular.module('mean.socket').directive('users', function (Global, MeanSocket, $stateParams, MeanUser) {
    return {
        restrict: 'EA',
        scope: {
            /*   messages:"=messages",
             message:"=message",
             send:"&",*/
        },
        templateUrl: 'socket/views/users.html',
        link: function (scope, elm, attr) {
            scope.user=MeanUser.user;
            scope.channel=$stateParams.category;
            scope.users=[];

            MeanSocket.on('users:channel:' + scope.channel, function (users) {
                if (users && users.length !== 0) {
                    console.log("users: " + users);
                    scope.users = users;
                }
            });
        }
    };
});
