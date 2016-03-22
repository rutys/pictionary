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


angular.module('mean.categories').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
        .state('categories', {
          url: '/categories',
          templateUrl: '/categories/views/list.html',
          resolve: {
            loggedin: function(MeanUser) {
              return MeanUser.checkLoggedin();
            }
          }
        })
 /*       .state('categories example page', {
      url: '/categories/example',
      templateUrl: 'categories/views/index.html',
          resolve: {
            loggedin: function(MeanUser) {
              return MeanUser.checkLoggedin();
            }
          }
        })
        .state('create category', {
          url: '/categories/create',
          templateUrl: '/categories/views/create.html',
          resolve: {
            loggedin: function(MeanUser) {
              return MeanUser.checkLoggedin();
            }
          }
        })
        .state('edit category', {
          url: '/categories/:categoryId/edit',
          templateUrl: '/categories/views/edit.html',
          resolve: {
            loggedin: function(MeanUser) {
              return MeanUser.checkLoggedin();
            }
          }
        })
        .state('category by id', {
          url: '/categories/:categoryId',
          templateUrl: '/categories/views/view.html',
          resolve: {
            loggedin: function(MeanUser) {
              return MeanUser.checkLoggedin();
            }
          }
        });*/
  }
]);
