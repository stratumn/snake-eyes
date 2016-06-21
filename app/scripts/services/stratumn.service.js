'use strict';

angular.module('snakeEyesApp')
  .service('StratumnService', StratumnService);

StratumnService.$inject = ['$http', '$q', 'envService'];

function StratumnService($http, $q, envService) {
  var service = this;

  var request = function(verb, url, data) {
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
  };

  var post = function(url, data) {
    data = data || {};
    return request('post', url, JSON.stringify(data));
  };

  var get = function(url) {
    return request('get', url);
  };

  this.init = function(gameId) {
    var url = envService.read('agentUrl') + '/maps';

    return post(url, gameId)
      .then(function(res) {
        service.linkHash = res.meta.linkHash;
        return res.meta.linkHash
      });
  };
}
