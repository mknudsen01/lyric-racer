var Racer = {};

Racer.Binder = function(config){
  this.game = config.game;
};

Racer.Binder.prototype = {
  keyDownListener: function(){
    $(document).on('keydown', this.game.keyPressed);
  }
};

Racer.Game = function(config){
  this.gameText = config.gameText;
};

Racer.Game.prototype = {
  printThing: function(){
    console.log(this.gameText);
  },

  keyPressed: function(event){
    console.log(event.which);
  }
};

$(document).ready(function(){
  gameText = $('.text').text().trim();
  Racer.game = new Racer.Game({
    gameText: gameText
  });
  new Racer.Binder({game: Racer.game}).keyDownListener();
});

