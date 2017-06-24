class game {
  constructor(latitude, longitude) {
    this.questions = [];
    this.score = 0;
    this.fullScore = 0;
    this.timestamp = +new Date();
    this.latitude = latitude;
    this.longitude = longitude;
  }
  addQuestion(question) {
    this.questions.push(question);
    this.updateScore(question.correct);
  }
  updateScore(correct) {
    this.fullScore++;
    if (correct) {
      this.score++;
    }
  }
  toJSON() {
    return {timestamp: this.timestamp, score: this.score, fullScore: this.fullScore, questions: this.questions}
  }
}

class question {
  constructor(correctWord, questionWord, imageUrl, correct, definition) {
    this.correctWord = correctWord;
    this.questionWord = questionWord;
    this.imageUrl = imageUrl;
    this.correct = correct;
    this.definition = definition;
  }
}

function saveGame(game, userID) {
  return new Promise(function(result) {
    firebase.database().ref('games/' + userID + '/' + game.timestamp).transaction(function(currentWord) {
      return game.toJSON();
    });
    cacheGame(game);
    result();
  });
}

function cacheGame(game) {
  var updatedGameHistory = [];
  window.localforage.getItem('gameHistory', function(err, gameHistory) {
    if (gameHistory) {
      gameHistory.push(game);
      updatedGameHistory = gameHistory;
    } else {
      updatedGameHistory = [game];
    }
  }).then(function() {
    window.localforage.setItem('gameHistory', updatedGameHistory).then(function() {
      console.log('game stored locally');
    });
  });

}