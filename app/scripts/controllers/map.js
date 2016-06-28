'use strict';

angular.module('snakeEyesApp')
  .controller('MapController', MapController);

MapController.$inject =['envService'];

function MapController(envService) {
  var vm = this;

  StratumnSDK.config.applicationUrl = envService.read('agentUrl');

  vm.mapId = '57714627f220497f29518388';
}

