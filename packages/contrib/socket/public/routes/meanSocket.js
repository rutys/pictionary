'use strict';

angular.module('mean.socket').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.state('Mean socket help page', {
                url: '/meansocket/help',
                templateUrl: 'socket/views/index.html'
            })
            .state('Pictionary game', {
                url: '/pictionaryGame/:category',
                templateUrl: 'socket/views/pictionaryGame.html'
            });
    }
]).run(['MeanSocket', '$rootScope',
    function (MeanSocket, $rootScope) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if(fromState.name==='Pictionary game'&&toState.name!=='Pictionary game')
                    MeanSocket.emit('disconnectFromGame');
            });
    }
]);
