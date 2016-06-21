'use strict';

angular.module('snakeEyesApp')
  .service('StratumnService', StratumnService);

StratumnService.$inject = ['$http', '$q', 'envService'];

function StratumnService($http, $q, envService) {
  this.init = init;
  this.play = play;
  this.chainscriptUrl = chainscriptUrl;

  var gameLinkHash, mapId;
  var playerBranchTip = {};

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
        gameLinkHash = res.meta.linkHash;
        return res;
      });
  }

  function createUser(player) {
    var url = envService.read('agentUrl') + '/links/' + gameLinkHash + '/createUser';

    return post(url, player)
      .then(function(res) {
        playerBranchTip[player] = res.meta.linkHash;
        return res;
      });
  }

  function play(score) {

    if (!playerBranchTip[score.player]) {
      createUser(score.player)
        .then(function() {
          return doPlay(score);
        });
    } else {
      return doPlay(score);
    }
  }

  function doPlay(score) {
    var url = envService.read('agentUrl') + '/links/' + playerBranchTip[score.player] + '/play';

    return post(url, [score.dice1, score.dice2])
      .then(function(res) {
        playerBranchTip[score.player] = res.meta.linkHash;
        return res;
      });

  }

  function chainscriptUrl() {
    return envService.read('agentUrl') + '/maps/' + mapId;
  }
}
