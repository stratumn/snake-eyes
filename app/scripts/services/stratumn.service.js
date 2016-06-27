'use strict';

angular.module('snakeEyesApp')
  .service('StratumnService', StratumnService);

StratumnService.$inject = ['envService'];

function StratumnService(envService) {
  this.init = init;
  this.register = register;
  this.roll = roll;
  this.chainscriptUrl = chainscriptUrl;
  this.mapId = null;

  StratumnSDK.config.applicationUrl = envService.read('agentUrl');

  var app = StratumnSDK.getApplication('snake-eyes');

  var appUrl;
   app.then(function(app) {
     appUrl = app.url;
   });

  var service = this;

  var playerBranchTip;

  function init(gameId) {
    return app
      .then(function(app) {
        return app.createMap(gameId);
      })
      .then(function(res) {
        service.mapId = res.link.meta.mapId;
        return res;
      });
  }

  function register(player, gameLinkHash) {
    return app
      .then(function(app) {
        return app.getLink(gameLinkHash);
      })
      .then(function(app) {
        return app.register(player.nick, player.address);
      })
      .then(function(res) {
        playerBranchTip = res;
        return res;
      });
  }

  function roll(message, signature) {
    if (!playerBranchTip) {
      throw 'User is not registered';
    }

    return playerBranchTip.roll(message, signature)
      .then(function(res) {
        playerBranchTip = res;
        return res.link.state;
      });
  }

  function chainscriptUrl() {
    if (service.mapId) {
      return appUrl + '/maps/' + service.mapId;
    }
  }
}
