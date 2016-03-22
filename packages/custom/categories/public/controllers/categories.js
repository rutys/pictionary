'use strict';

/* jshint -W098 */
angular.module('mean.categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Global', 'Categories', 'MeanUser', 'Circles',
  function($scope, $stateParams, $location, Global, Categories, MeanUser, Circles) {
    $scope.global = Global;
    $scope.package = {
      name: 'categories'
    };

    $scope.init = function() {
      Categories.query({}, function(categories) {
        $scope.categories = categories;
      });
    };
  }


]);

