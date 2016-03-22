'use strict';

angular.module('mean.paint').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('paint example page', {
      url: '/paint/example',
      templateUrl: 'paint/views/index.html'
    });
  }
]);
