'use strict';

angular.module('snakeEyesApp')
  .controller('GameController', GameController);

GameController.$inject = ['$routeParams', '$scope', '$mdDialog', 'GameService'];

function GameController($routeParams, $scope, $mdDialog, GameService) {
  var vm = this;

  vm.gameId = $routeParams.gameId;
  vm.rollDice = rollDice;
  vm.play = play;
  vm.showDice = showDice;
  vm.disabled = false;
  vm.isDisabled = isDisabled;

  function rollDice() {
    vm.disabled = true;
    GameService.roll().then(function(res) {
      vm.dice1 = res.dice1;
      vm.dice2 = res.dice2;
      vm.rolls = res.rolls;
      vm.disabled = false;
      $scope.$apply();

      if (hasWon()) {
        showWinningDialog();
      }
    });
  }

  function play() {
    if (vm.nick && vm.gameId) {
      GameService.register(vm.gameId.toLowerCase(), vm.nick)
        .then(function(game) {
          if (game) {
            vm.ready = true;
          }
        });
    }
  }

  function showDice() {
    return vm.gameId && vm.nick && vm.ready;
  }

  function isDisabled() {
    return vm.disabled || hasWon();
  }

  function hasWon() {
    return vm.dice1 === 1 && vm.dice2 === 1;
  }

  function showWinningDialog() {
    alert = $mdDialog.alert()
      .title('You won after ' + vm.rolls + ' rolls!')
      .htmlContent('<img src="/images/Winner.png">')
      .ok('Close')
      .theme('splash');
    $mdDialog
      .show(alert)
      .finally(function() {
        alert = undefined;
      });
  }
}

