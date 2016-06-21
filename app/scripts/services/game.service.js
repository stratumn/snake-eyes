'use strict';

angular
  .module('snakeEyesApp')
  .service('GameService', GameService);

GameService.$inject = ['PeerService', 'StratumnService'];

function GameService(PeerService, StratumnService) {

  this.startGame = function(nick, gameId) {
    this.nick = nick;
    PeerService.connect(nick, gameId);
  };

  this.play = function(dice1, dice2) {
    PeerService.send([this.nick, dice1, dice2]);
  };

  this.listen = function(scores, winners, cb) {
    PeerService.receive(function(data) {
      var player = data[0];
      var dice1 = data[1];
      var dice2 = data[2];
      var score = { player: player, dice1: dice1, dice2: dice2 };
      scores.push(score);
      
      if (dice1 === 1 && dice2 === 1) {
        winners.push(player);
      }

      StratumnService.play(score);
      cb();
    });
  };
}
