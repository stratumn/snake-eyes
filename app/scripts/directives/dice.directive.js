angular
  .module('snakeEyesApp')
  .directive('dice', Dice);

Dice.$inject = ['DiceConverterService'];

function Dice(DiceConverterService) {

  return {
    restrict: 'E',
    scope: {
      value: '='
    },
    template: '<i class="ux ico-dice-{{convertResult(value)}}"></i>',
    link: function(scope) {
      scope.convertResult = DiceConverterService.convertResult;
    }
  };


}
