'use strict';
/*
angular.module('mean.categories').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('categories example page', {
      url: '/categories/example',
      templateUrl: 'categories/views/index.html'
    });
  }
]);*/


angular.module('mean.scores').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
        .state('scores', {
          url: '/scores',
          templateUrl: '/scores/views/users-scores.html',
          resolve: {
            loggedin: function(MeanUser) {
              return MeanUser.checkLoggedin();
            }
          }
        })
  }
]);
