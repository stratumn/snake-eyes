angular
  .module('snakeEyesApp')
  .service('DiceConverterService', DiceConverterService);

function DiceConverterService() {

  var englishResult = ['', 'one', 'two', 'three', 'four', 'five', 'six'];

  this.convertResult = function(result) {
    //console.log(result);
    return englishResult[result];
  }
}
