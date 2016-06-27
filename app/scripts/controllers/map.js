'use strict';

angular.module('snakeEyesApp')
  .controller('MapController', MapController);


function MapController() {
  var vm = this;

  vm.mapUrl = 'http://snake-eyes.lvh.me:3001/maps/576969daf220497f29518061';
}

