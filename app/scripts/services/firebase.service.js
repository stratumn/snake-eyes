angular
  .module('snakeEyesApp')
  .service('FirebaseService', FirebaseService);

FirebaseService.$inject = ['$q'];

function FirebaseService($q) {

  this.getGameLinkHash = getGameLinkHash;
  this.setGameLinkHash = setGameLinkHash;
  this.listenToScores = listenToScores;

  var mapId;

  var config = {
    apiKey: 'AIzaSyCjUBHCRE65NGvsfKLkq056qBukSh-r1_Y',
    authDomain: 'snake-eyes-af2d1.firebaseapp.com',
    databaseURL: 'https://snake-eyes-af2d1.firebaseio.com',
    storageBucket: 'snake-eyes-af2d1.appspot.com'
  };

  firebase.initializeApp(config);

  function getGameLinkHash(gameId) {
    var deferred = $q.defer();

    firebase.database().ref('games/' + gameId + '/linkHash').on('value', function(snapshot) {
      mapId = snapshot.val();
      deferred.resolve(mapId);
    });

    return deferred.promise;
  }

  function setGameLinkHash(gameId, hash) {
    return firebase.database().ref('/games/' + gameId).set({
      linkHash: hash
    });
  }

  function listenToScores(gameId, cb) {
    var rollsRef = firebase.database().ref('rolls/' + gameId);
    rollsRef.on('child_added', function(data) {
      cb(data.val());
    });
  }
}
