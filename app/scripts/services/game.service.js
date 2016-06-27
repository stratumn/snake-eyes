'use strict';

angular
  .module('snakeEyesApp')
  .service('GameService', GameService);

var Message = require('bitcore-message');
var Bitcore  = require('bitcore-lib');

GameService.$inject = ['$mdToast', 'FirebaseService', 'StratumnService'];

function GameService($mdToast, FirebaseService, StratumnService) {

  var nick, privateKey, gameId;

  this.startGame = function(newGameId) {
    gameId = newGameId;

    return FirebaseService.getGameInfo(gameId)
      .then(function(game) {
        if (game) {
          StratumnService.mapId = game.mapId;
        } else {
          return StratumnService.init(gameId)
            .then(function(res) {
              FirebaseService.setGameInfo(gameId, {
                gameLinkHash: res.meta.linkHash,
                mapId: res.link.meta.mapId
              });
            });
        }
      });
  };

  this.register = function(newGameId, newNick) {
    gameId = newGameId;
    nick = newNick;
    privateKey = new Bitcore.PrivateKey();

    return FirebaseService.getGameInfo(gameId)
      .then(function(game) {
        if (game) {
          return StratumnService.register(
            {
              nick: nick,
              address: privateKey.toAddress().toString()
            }, game.gameLinkHash);
        } else {
          $mdToast.show($mdToast.simple().textContent('Game ' + gameId + ' not found.').theme('error'));
        }
      });
  };

  this.roll = function() {

    var message = new Message(Date.now() + '');
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
