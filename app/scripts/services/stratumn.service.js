'use strict';

angular.module('snakeEyesApp')
  .service('StratumnService', StratumnService);

StratumnService.$inject = ['$http', '$q', 'envService'];

function StratumnService($http, $q, envService) {
  this.init = init;
  this.register = register;
  this.roll = roll;
  this.chainscriptUrl = chainscriptUrl;

  var mapId, playerBranchTip;

  function request(verb, url, data) {
    var deferred = $q.defer();

    $http[verb](url, data)
      .success(function(res) {
        if (res.meta && res.meta.errorMessage) {
          var msg = res.meta.errorMessage;
          console.log(msg);
          deferred.reject(msg);
        }
        else {
          deferred.resolve(res);
        }
      })
      .error(function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }

  function post(url, data) {
    data = data || {};
    return request('post', url, JSON.stringify(data));
  }

  function get(url) {
    return request('get', url);
  }

  function init(gameId) {
    var url = envService.read('agentUrl') + '/maps';

    return post(url, gameId)
      .then(function(res) {
        console.log(res);

        mapId = res.link.meta.mapId;
        return res;
      });
  }

  function register(player, gameLinkHash) {
    var url = envService.read('agentUrl') + '/links/' + gameLinkHash + '/register';

    return post(url, [player.nick, player.address])
      .then(function(res) {
        playerBranchTip = res.meta.linkHash;
        return res;
      });
  }

  function roll(message, signature) {
    if (!playerBranchTip) {
      throw 'User is not registered';
    }

    var url = envService.read('agentUrl') + '/links/' + playerBranchTip + '/roll';

    return post(url, [message, signature])
      .then(function(res) {
        playerBranchTip = res.meta.linkHash;
        return res.link.state;
      });
  }

  function doRoll(message, signature) {
  }

  function chainscriptUrl() {
    if (mapId) {
      return envService.read('agentUrl') + '/maps/' + mapId;
    }
  }
}
