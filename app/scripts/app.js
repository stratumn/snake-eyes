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
    'ngMaterial',
    'environment'
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
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapController',
        controllerAs: 'map'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(envServiceProvider) {
    // set the domains and variables for each environment
    envServiceProvider.config({
      domains: {
        development: ['localhost:9000'],
        production: ['snakeeyes.stratumn.com', 'snakeeyes.stratumn.com.s3-eu-west-1.amazonaws.com']
      },
      vars: {
        development: {
          agentUrl: 'http://snake-eyes.lvh.me:3001'
        },
        production: {
          agentUrl: 'https://snake-eyes.stratumn.net'
        }
      }
    });
    // run the environment check, so the comprobation is made
    // before controllers and services are built
    envServiceProvider.check();
  });
