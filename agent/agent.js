'use strict';

const Message = require('bitcore-message');

const Firebase = require('firebase');

const config = {
  apiKey: "AIzaSyCjUBHCRE65NGvsfKLkq056qBukSh-r1_Y",
  authDomain: "snake-eyes-af2d1.firebaseapp.com",
  databaseURL: "https://snake-eyes-af2d1.firebaseio.com",
  storageBucket: "snake-eyes-af2d1.appspot.com",
};

var firebase = new Firebase(config.databaseURL);

const rollDie = function() {
  return Math.ceil(Math.random() * 6);
};

module.exports = {

  init: function(gameId) {
    this.state.gameId = gameId;
    this.append();
  },

  register: function(nick, address) {
    this.state.nick = nick;
    this.state.address = address;
    this.state.messages = [];
    this.state.rolls = 0;
    this.append();
  },

  roll: function(message, signature) {
    var replay = (this.state.messages.indexOf(message) >= 0);
    var signed = new Message(message).verify(this.state.address, signature);

    if (!replay && signed) {
      this.state.messages.push(message);
      this.state.signature = signature;
      this.state.dice1 = rollDie();
      this.state.dice2 = rollDie();
      this.state.rolls++;

      if (this.state.dice1 === 1 && this.state.dice2 === 1) {
        this.meta.tags = ['win'];
      }

      var rollKey = firebase.child(`rolls/${this.state.gameId}`).push().key();

      return firebase.child(`rolls/${this.state.gameId}/${rollKey}`).update({
        nick: this.state.nick,
        dice1: this.state.dice1,
        dice2: this.state.dice2,
        rolls: this.state.rolls
      }).then(() => this.append())
        .catch(err => this.reject(err)
      );

    } else {
      let error;
      if (replay){
        error = `Message ${message} was already received`;
      } else {
        error = `Message ${message} was not signed with your public key ${this.state.address}: ${signature}.`;
      }
      this.reject(`Invalid play: ${error}`);
    }
  }
};
