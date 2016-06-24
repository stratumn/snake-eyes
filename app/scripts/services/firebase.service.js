angular
  .module('snakeEyesApp')
  .service('FirebaseService', FirebaseService);

FirebaseService.$inject = ['$q'];

function FirebaseService($q) {

  this.getGameInfo = getGameInfo;
  this.setGameInfo = setGameInfo;
  this.listenToScores = listenToScores;

  var mapId;

  var config = {
    apiKey: 'AIzaSyCjUBHCRE65NGvsfKLkq056qBukSh-r1_Y',
    authDomain: 'snake-eyes-af2d1.firebaseapp.com',
    databaseURL: 'https://snake-eyes-af2d1.firebaseio.com',
    storageBucket: 'snake-eyes-af2d1.appspot.com'
  };

  firebase.initializeApp(config);

  function getGameInfo(gameId) {
    var deferred = $q.defer();

    firebase.database().ref('games/' + gameId).on('value', function(snapshot) {
      deferred.resolve(snapshot.val());
    });

    return deferred.promise;
  }

  function setGameInfo(gameId, game) {
    return firebase.database().ref('/games/' + gameId).set(game);
  }

  function listenToScores(gameId, cb) {
    var rollsRef = firebase.database().ref('rolls/' + gameId);
    rollsRef.on('child_added', function(data) {
      cb(data.val());
    });
  }
}
