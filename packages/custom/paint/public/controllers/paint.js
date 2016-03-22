'use strict';

/* jshint -W098 */
angular.module('mean.paint').controller('PaintController', ['$scope', 'Global', 'Paint',
  function($scope, Global, Paint) {
    $scope.global = Global;
    $scope.package = {
      name: 'paint'
    };
  }
]);
