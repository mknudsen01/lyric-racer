var Racer = {};



Racer.Game = function(config){
  this.gameText = config.gameText;
};

Racer.Game.prototype = {
  printThing: function(){
    console.log(this.gameText);
  }
};

$(document).ready(function(){
  gameText = $('.text').text().trim();
  Racer.game = new Racer.Game({
    gameText: gameText
  });
});

