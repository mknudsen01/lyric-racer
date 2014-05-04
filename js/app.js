var Racer = {};

Racer.Binder = function(config){
  this.game = config.game;
};

Racer.Binder.prototype = {
  keyDownListener: function(){
    $(document).on('keydown', this.game.keyPressed.bind(this.game));
  }
};

Racer.Game = function(config){
  this.gameText = config.gameText;
  this.counters = {
    correct: 0,
    incorrect: 0
  };
};

Racer.Game.prototype = {
  printThing: function(){
    console.log(this.gameText);
  },

  keyPressed: function(event){
    var pressedCharacter = this.getPressedCharacter(event);
    if(pressedCharacter){
      this.checkCorrect(pressedCharacter);
    }
  },

  checkCorrect: function(character){
    nextCorrectCharacter = this.gameText[this.counters.correct];
    if(character == nextCorrectCharacter){
      console.log("Yes!");
      this.incrementCounter('correct');
    } else {
      console.log("No");
      this.incrementCounter('incorrect');
    }
  },

  incrementCounter: function(type){
    this.counters[type]++;
  },

  getPressedCharacter: function(event){
    var _to_ascii = {
      '186': '59',
      '187': '61',
      '188': '44',
      '189': '45',
      '190': '46',
      '191': '47',
      '192': '96',
      '220': '92',
      '222': '39',
      '221': '93',
      '219': '91',
      '173': '45',
    };

    var shiftUps = {
      "16": "shift",
      "32": " ",
      "96": "~",
      "49": "!",
      "50": "@",
      "51": "#",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "48": ")",
      "45": "_",
      "61": "+",
      "91": "{",
      "93": "}",
      "92": "|",
      "59": ":",
      "39": "\"",
      "44": "<",
      "46": ">",
      "47": "?"
    };


    event.preventDefault();

    var characterCode = event.which;
    var character = '';
    if(_to_ascii.hasOwnProperty(characterCode)){
      characterCode = _to_ascii[characterCode];
    }

    if(!event.shiftKey && (characterCode>=65 && characterCode<=90)){
      character = String.fromCharCode(characterCode + 32);
    } else if(event.shiftKey && shiftUps.hasOwnProperty(characterCode)) {
      character = shiftUps[characterCode];
    } else {
      character = String.fromCharCode(characterCode);
    }

    if(character != "shift"){
      return character;
    }
  }
};

$(document).ready(function(){
  gameText = $('.text').text().trim();
  Racer.game = new Racer.Game({
    gameText: gameText
  });
  new Racer.Binder({game: Racer.game}).keyDownListener();
});

