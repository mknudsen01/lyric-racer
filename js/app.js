var Racer = {};

Racer.Binder = function(config){
  this.game = config.game;
};

Racer.Binder.prototype = {
  keyDownListener: function(){
    $(document).on('keydown', this.game.keyPressed.bind(this.game));
  }
};

Racer.View = function(){};

Racer.View.prototype = {
  updateIncorrectCount: function(counters){
    console.log(counters.incorrect);
    $('.incorrect p').html(counters.incorrect);
  },

  resetIncorrectCount: function(){
    $('.incorrect p').html(0);
  },

  buildLetter: function(text, index){
    letter = $('.letter-template').html().trim();
    $letter = $(letter);
    $letter.html(text);
    $letter.attr('class', index);
    return $letter;
  },

  renderLetter: function(text, index){
    $('.text').append(this.buildLetter(text, index));
  }
};

Racer.Game = function(config){
  this.gameText = config.gameText;
  this.view = config.view;
  this.counters = {
    correct: 0,
    incorrect: 0
  };
};

Racer.Game.prototype = {
  init: function(){
    this.renderGameText();
  },

  renderGameText: function(){
    letters = this.gameText.split('');
    var lettersLength = letters.length;
    for(var i=0; i<lettersLength; i++){
      var letter = letters[i];
      this.view.renderLetter(letter, i);
    }
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
      if(this.checkForVictory()){
        this.resetCounters();
      }
    } else {
      console.log("No");
      this.incrementCounter('incorrect');
    }
    this.view.updateIncorrectCount(this.counters);
  },

  resetCounters: function(){
    for(var counter in this.counters){
      this.counters[counter] = 0;
    }
  },

  checkForVictory: function(){
    return (this.counters.correct === this.gameText.length)
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
  gameText = $('.starter-text p').text().trim();
  Racer.view = new Racer.View();
  Racer.game = new Racer.Game({
    gameText: gameText,
    view: Racer.view
  });
  new Racer.Binder({game: Racer.game}).keyDownListener();
  Racer.game.init();
});

