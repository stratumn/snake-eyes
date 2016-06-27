'use strict';

angular.module('snakeEyesApp')
  .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', 'GameService', 'StratumnService'];

function DashboardController($scope, GameService, StratumnService) {
  var vm = this;

  vm.start = start;
  vm.scores = [];
  vm.winners = [];
  vm.chainscriptUrl = StratumnService.chainscriptUrl;

  function start() {
    GameService.startGame(vm.gameId.toLowerCase());
    GameService.listen(vm.scores, vm.winners, cb);
    vm.ready = true;
  }

  function cb() {
    $scope.$apply();
  }

}
