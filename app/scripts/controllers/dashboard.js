'use strict';

angular.module('snakeEyesApp')
  .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', 'GameService'];

function DashboardController($scope, GameService) {
  var vm = this;

  vm.start = start;
  vm.scores = [];
  vm.winners = [];

  function start() {
    GameService.startGame(vm.gameId);
    GameService.listen(vm.scores, vm.winners, cb);
    vm.ready = true;
  }

  function cb() {
    $scope.$apply();
  }

}
