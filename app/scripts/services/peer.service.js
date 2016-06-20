angular
  .module('snakeEyesApp')
  .service('PeerService', PeerService);

function PeerService() {

  this.API_KEY = '8xttj4szjns46lxr';

  this.connect = function(id, peerId) {
    this.peer = new Peer(id, {key: this.API_KEY});
    console.log('Connected as ' + id + '.');
    this.peerId = peerId;
  };

  this.send = function(data) {
    console.log('Connecting to ' + this.peerId + '...');
    var conn = this.peer.connect(this.peerId);
    conn.on('open', function() {
      conn.send(data);
    });
  };

  this.receive = function(cb) {
    this.peer.on('connection', function(conn) {
      conn.on('data', function(data){
        cb(data);
      });
    });
  }
}
