'use strict';

angular.module('snakeEyesApp')
  .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', 'GameService', 'StratumnService', 'envService'];

function DashboardController($scope, GameService, StratumnService, envService) {
  var vm = this;

  StratumnSDK.config.applicationUrl = envService.read('agentUrl');

  vm.start = start;
  vm.scores = [];
  vm.winners = [];

  function start() {
    GameService.startGame(vm.gameId.toLowerCase())
      .then(function() {
        GameService.listen(vm.scores, vm.winners, cb);
        vm.ready = true;
        vm.mapId = StratumnService.mapId;
      });
  }

  function cb() {
    $scope.$apply();
  }

}
