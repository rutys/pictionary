'use strict';

/* jshint -W098 */
angular.module('mean.scores').controller('ScoresController', ['$scope', '$stateParams', '$location', 'Global', 'Scores', 'MeanUser', 'Circles',
  function($scope, $stateParams, $location, Global, Scores, MeanUser, Circles) {
    $scope.global = Global;
    $scope.package = {
      name: 'scores'
    };

    $scope.init = function() {
      Scores.query({}, function(scores) {
        $scope.scores = scores;
      });
    };
  }


]);

