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
    $('.incorrect').find('.count').html(counters.incorrect);
  },

  resetIncorrectCount: function(){
    $('.incorrect').find('.count').html(0);
  },

  buildLetter: function(text, index){
    letter = $('.letter-template').html().trim();
    $letter = $(letter);
    $letter.html(text);
    $letter.attr('class', 'letter-'+index);
    return $letter;
  },

  buildLine: function(lineNumber){
    line = $('.line-template').html().trim();
    $line = $(line);
    $line.attr('class', 'line-'+lineNumber);
    return $line;
  },

  renderLine: function(line){
    $('.text').append(this.buildLine(line.lineNumber));
    var lineLength = line.letters.length;
    for (var i=0; i < lineLength; i++){
      var letter = line.letters[i];
      this.renderLetter(letter.text, letter.position, line.lineNumber);
    }
  },

  renderLetter: function(text, position, lineNumber){
    $('.line-'+lineNumber).append(this.buildLetter(text, position));
  },

  updateLetter: function(letterPosition, lineNumber){
    $('.line-'+lineNumber).find('.letter-'+letterPosition).toggleClass('correct-letter');
  },

  clearText: function(){
    $('.text').empty();
  },

  addCurrentLineClass: function(lineNumber){
    if(!lineNumber){
      lineNumber = '0';
    }
    $('.text').find('.line-'+lineNumber).addClass('current-line-bar');
  },

  removeCurrentLineClass: function(lineNumber){
    $('.text').find('.line-'+lineNumber).removeClass('current-line-bar');
  },


  fillFinishedBackground: function(lineNumber){
    $('.line-'+lineNumber).css('background-color', '#1abc9c');
  },

  moveToNextLine: function(){
    $('.text').animate({
      top: "-=37"
    }, 50);
  },

  roundTop: function(lineNumber){
    $(".line-"+lineNumber).css('border-top-left-radius', "3px");
    $(".line-"+lineNumber).css('border-top-right-radius', "3px");
    $(".line-"+lineNumber).find(".letter-0").css("border-top-left-radius","3px");
  },

  resetTextPosition: function(amountToMove){
    $('.text').animate({
      'top': '+='+amountToMove
    }, 200, this.addCurrentLineClass);
  },

  reduceOpacity: function(lineNumber){
    $('.line-'+lineNumber).animate({
      opacity: "-=.5"
    }, 1000);
  }
};

Racer.Game = function(config){
  this.gameText = config.gameText;
  this.view = config.view;
  this.counters = {
    correct: 0,
    incorrect: 0,
    lineNumber: 0,
    currentLetter: 0
  };
  this.lines = [];
};

Racer.Game.prototype = {
  init: function(){
    this.getLines();
    this.splitLines();
    this.sanitizeLines();
    this.renderLines();
    this.view.addCurrentLineClass(0);
  },

  resetGame: function(){
    this.view.clearText();
    var amountToMove = (this.lines.length - 1) * 37;
    this.view.resetTextPosition(amountToMove);
    this.resetCounters();
    this.renderLines();
  },

  sanitizeLines: function(){
    for (var i=0; i< this.lines.length; i++){
      var line = this.lines[i];
      if(line.text === ""){
        this.lines.splice(i, 1);
        i = -1;
      }
    }
  },

  renderLines: function(){
    var linesLength = this.lines.length;
    for (var i= 0; i<linesLength; i++){
      var line = this.lines[i];
      this.view.renderLine(line);
    }
  },

  getLines: function(){
    splitText = this.gameText.split('--');
    for (var i=0; i<splitText.length; i++){
      var line = splitText[i].trim();
      this.addLine(line, i);
    }
  },

  addLine: function(lineText, position){
    this.lines.push(new Racer.Line(lineText, position));
  },

  splitLines: function(){
    var linesLength = this.lines.length;
    for (var i=0; i< linesLength; i++){
      this.lines[i].splitLine();
    }
  },

  keyPressed: function(event){
    var pressedCharacter = this.getPressedCharacter(event);
    if(pressedCharacter){
      this.checkCorrect(pressedCharacter);
    }
  },

  checkCorrect: function(character){
    var currentLineNumber = this.counters.lineNumber;
    var line = this.lines[currentLineNumber];
    var nextCorrectCharacter = line.text[this.counters.currentLetter];
    if(character == nextCorrectCharacter){
      this.correctLetterPressed(currentLineNumber);
      if(this.lastLetterInLine(line)){
        this.nextLineEvent(currentLineNumber);
        if(this.checkForVictory()){
          this.resetGame();
        }
      }
    } else {
      this.incrementIncorrectCounter();
    }
    this.view.updateIncorrectCount(this.counters);
  },

  correctLetterPressed: function(currentLineNumber){
    this.view.updateLetter(this.counters.currentLetter, currentLineNumber);
    this.incrementCorrectCounter();
    this.incrementCurrentLetterCounter();
  },

  nextLineEvent: function(currentLineNumber){
    this.incrementLineNumberCounter();
    this.view.moveToNextLine();
    this.view.fillFinishedBackground(currentLineNumber);
    this.view.removeCurrentLineClass(currentLineNumber);
    this.view.reduceOpacity(currentLineNumber -1 );
    this.view.reduceOpacity(this.counters.lineNumber - 1);
    this.view.roundTop(this.counters.lineNumber - 1);
    this.view.addCurrentLineClass(this.counters.lineNumber);
    this.counters.currentLetter = 0;
  },

  lastLetterInLine: function(line){
    return this.counters.currentLetter === line.letters.length;
  },

  resetCounter: function(type){
    this.counters[type] = 0;
  },

  resetCounters: function(){
    for(var counter in this.counters){
      this.counters[counter] = 0;
    }
  },

  checkForVictory: function(){
    return (this.counters.lineNumber === this.lines.length);
  },

  incrementCorrectCounter: function(type){
    this.counters.correct++;
  },

  incrementIncorrectCounter: function(type){
    this.counters.incorrect++;
  },

  incrementLineNumberCounter: function(type){
    this.counters.lineNumber++;
  },

  incrementCurrentLetterCounter: function(type){
    this.counters.currentLetter++;
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

    var ignores = {
      "27": "nope", //escape
      "38": "nope", //up
      "40": "nope", //down
      "91": "nope"
    };

    var shiftUps = {
      "16": "nope", //shift
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
      "93": "}",
      "92": "|",
      "59": ":",
      "39": "\"",
      "44": "<",
      "46": ">",
      "47": "?"
    };
    if(event.which === 32 || event.which === 91){
      event.preventDefault();
    }

    var characterCode = event.which;
    var character = '';
    if(_to_ascii.hasOwnProperty(characterCode)){
      characterCode = _to_ascii[characterCode];
    }

    if(!event.shiftKey && (characterCode>=65 && characterCode<=90)){
      character = String.fromCharCode(characterCode + 32);
    } else if(ignores.hasOwnProperty(characterCode)){
      character = ignores[characterCode];
    }  else if(event.shiftKey && shiftUps.hasOwnProperty(characterCode)) {
      character = shiftUps[characterCode];
    } else {
      character = String.fromCharCode(characterCode);
    }
    if(character != "nope"){
      return character;
    }
  }
};

Racer.Letter = function(text, position){
  this.text = text;
  this.position = position;
};

Racer.Letter.prototype = {};

Racer.Line = function(text, lineNumber){
  this.text = text;
  this.lineNumber = lineNumber;
  this.letters = [];
};

Racer.Line.prototype = {
  splitLine: function(){
    var splitLine = this.text.split('');
    var splitLineLength = splitLine.length;
    for ( var i=0; i<splitLineLength; i++){
      var letter = splitLine[i];
      this.createLetter(letter, i);
    }
  },

  createLetter: function(text, position){
    this.letters.push(new Racer.Letter(text, position));
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

