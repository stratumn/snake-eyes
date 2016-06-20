angular
  .module('snakeEyesApp')
  .service('GameService', GameService);

GameService.$inject = ['PeerService'];

function GameService(PeerService) {

  this.startGame = function(nick, gameId) {
    this.nick = nick;
    PeerService.connect(nick, gameId);
  };

  this.play = function(dice1, dice2) {
    PeerService.send([this.nick, dice1, dice2]);
  };

  this.listen = function(scores, winners, cb) {
    PeerService.receive(function(data) {
      player = data[0];
      dice1 = data[1];
      dice2 = data[2];
      scores.push({ player: player, dice1: dice1, dice2: dice2 });

      if (dice1 == 1 && dice2 == 1) {
        winners.push(player);
      }

      cb();
    })
  }
}
