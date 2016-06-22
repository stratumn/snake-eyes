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

  function rollDice() {
    GameService.roll().then(function(res) {

      console.log(res);

      vm.dice1 = res.dice1;
      vm.dice2 = res.dice2;
      vm.rolls = res.rolls;
    });
  }

  function play() {
    if (vm.nick && vm.gameId) {
      GameService.register(vm.gameId, vm.nick)
        .then(function() {
          vm.ready = true;
        })
    }
  }

  function showDice() {
    return vm.gameId && vm.nick && vm.ready;
  }
}

