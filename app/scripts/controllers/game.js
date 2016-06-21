'use strict';

angular.module('snakeEyesApp')
  .controller('GameController', GameController);

GameController.$inject = ['$routeParams', 'GameService'];

function GameController($routeParams, GameService) {
  var vm = this;

  vm.gameId = $routeParams.gameId;
  vm.rollDice = rollDice;
  vm.play = play;
  vm.showDice = showDice;
  vm.remainingRolls = 10;

  function rollDice() {
    vm.dice1 = rollDie();
    vm.dice2 = rollDie();
    GameService.play(vm.dice1, vm.dice2);
    vm.remainingRolls--;
  }

  function play() {
    if (vm.nick && vm.gameId) {
      GameService.startGame(vm.nick, vm.gameId);
      vm.ready = true;
    }
  }

  function showDice() {
    return vm.gameId && vm.nick && vm.ready;
  }

  function rollDie() {
    return Math.ceil(Math.random() * 6);
  }
}

