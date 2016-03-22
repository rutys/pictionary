'use strict';


angular.module('mean.scores').factory('Scores', ['$resource',
  function($resource) {
    return $resource('api/scores/:scoreId', {
      scoreId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);