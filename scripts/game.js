class game {
  constructor(latitude, longitude) {
    this.questions = [];
    this.score = 0;
    this.fullScore = 0;
    this.timestamp = Math.floor((+new Date())/1000);
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
    cacheGame(game, userID);
    result();
  });
}

function cacheGame(game, uid) {
    var updatedGameHistory = [];
    window.localforage.getItem(uid, function(err, gameHistory) {
    if (gameHistory) {
      gameHistory.push(game);
      updatedGameHistory = gameHistory;
    } else {
      updatedGameHistory = [game];
    }
    }).then(function() {
      window.localforage.setItem(uid, updatedGameHistory).then(function() {
        console.log('game stored locally');
      });
    });
}

function updatePastPlayers(game, uid){
  return new Promise(function(result){
    firebase.database().ref(`highscores/${game.latitude}/${game.longitude}`).transaction(function(ranking){
      if(ranking === null){
        return {
          top: game.score,
            recentPlayers: {
              1: uid
            }
        }
      }else{
        var topScore = ranking['top'];
        var recentPlayers = ranking['recentPlayers'];
        var data = {
          top: topScore,
            recentPlayers: recentPlayers
        };
        if(topScore < game.score){
          data['top'] = game.score
        }
        var allPlayers = Object.keys(recentPlayers);
        for(var i = Math.min(5, allPlayers.length+1); i > 0; i--){
          data['recentPlayers'][i] = data['recentPlayers'][i-1];
        }
        data['recentPlayers'][1] = uid;
        return data;
      }
    });
    return result();
  })
}