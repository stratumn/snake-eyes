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
    'environment',
    'rt.debounce'
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
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('error');
    $mdThemingProvider.theme('splash');
  })
  .config(function(envServiceProvider) {
    // set the domains and variables for each environment
    envServiceProvider.config({
      domains: {
        development: ['localhost:9000'],
        production: ['snakeeyes.stratumn.com']
      },
      vars: {
        development: {
          agentUrl: 'http://%s.lvh.me:3001'
        },
        production: {
          agentUrl: 'https://%s.stratumn.net'
        }
      }
    });
    // run the environment check, so the comprobation is made
    // before controllers and services are built
    envServiceProvider.check();
  });
