'use strict';

/**
 * @ngdoc overview
 * @name snakeEyesApp
 * @description
 * # snakeEyesApp
 *
 * Main module of the application.
 */
angular
  .module('snakeEyesApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/game.html',
        controller: 'GameController',
        controllerAs: 'game'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
