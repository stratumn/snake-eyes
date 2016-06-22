'use strict';

angular
  .module('snakeEyesApp')
  .service('GameService', GameService);

var Message = require('bitcore-message');
var Bitcore  = require('bitcore-lib');

GameService.$inject = ['FirebaseService', 'StratumnService'];

function GameService(FirebaseService, StratumnService) {

  var nick, privateKey, gameId;

  this.startGame = function(newGameId) {
    gameId = newGameId;

    return StratumnService.init(gameId)
      .then(function(res) {
        FirebaseService.setGameLinkHash(gameId, res.meta.linkHash);
      });
  };

  this.register = function(newGameId, newNick) {
    gameId = newGameId;
    nick = newNick;
    privateKey = new Bitcore.PrivateKey();

    return FirebaseService.getGameLinkHash(gameId)
      .then(function(gameLinkHash) {
        return StratumnService.register(
          {
            nick: nick,
            address: privateKey.toAddress().toString()
          }, gameLinkHash);
      });
  };

  this.roll = function() {

    var message = new Message(new Date().getMilliseconds() + "");
    var signature = message.sign(privateKey);

    return StratumnService.roll(message.message, signature);
  };

  this.listen = function(scores, winners, cb) {
    FirebaseService.listenToScores(gameId, function(data) {
      var player = data.nick;
      var dice1 = data.dice1;
      var dice2 = data.dice2;
      var score = { player: player, dice1: dice1, dice2: dice2 };
      scores.push(score);

      if (dice1 === 1 && dice2 === 1) {
        winners.push({player: player, rolls: data.rolls});
      }

      cb();
    });
  };
}
