module.exports = {

  init: function(gameId) {
    this.state.gameId = gameId;
    this.append();
  },

  createUser: function(nick) {
    this.state.nick = nick;
    this.append();
  },

  play: function(dice1, dice2) {
    this.state.dice1 = dice1;
    this.state.dice2 = dice2;

    if (this.state.dice1 === 1 && this.state.dice2 === 1) {
      this.meta.tags = ['win'];
    }
    this.append();
  }
};
