'use strict';

angular.module('snakeEyesApp')
  .controller('GameController', GameController);

GameController.$inject = ['GameService'];

function GameController(GameService) {
  var vm = this;

  vm.throwDice = throwDice;
  vm.play = play;
  vm.showDice = showDice;

  function throwDice() {
    vm.dice1 = throwDie();
    vm.dice2 = throwDie();
    GameService.play(vm.dice1, vm.dice2);
  }

  function play() {
    GameService.startGame(vm.nick, vm.gameId);
    vm.ready = true;
  }

  function showDice() {
    return vm.gameId && vm.nick && vm.ready
  }

  function throwDie() {
    return Math.ceil(Math.random() * 6);
  }
}

