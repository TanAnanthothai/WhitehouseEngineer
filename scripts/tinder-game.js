var wordList = '';
var dictionary = '';
var questionNumber = 0;
var score = 0;
var currentQuestion;
var currentGame;
var isEnd = false;

// legacy function when single word list with lat long is attempted first before all lists are loaded
// function initializeGame(callback) {
//     questionNumber = 0;
//     score = 0;
//     currentQuestion = null;
//     currentGame = new game();
//     isEnd = false;
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             lat = position.coords.latitude;
//             long = position.coords.longitude;
//             console.log(lat);
//             console.log(long);
//             getWords(lat, long).then(function(words) {
//                 if(words.val() !== null){
//                     dictionary = words.val();
//                     wordList = shuffleArray(Object.keys(dictionary));
//                     callback();
//                 }else{
//                     getAllWordLists().then(function(result){
//                         allWordLists = result.val();
//                         allWordListsLatKey = Object.keys(allWordLists);
//                         let randomLat = Math.floor(Math.random()*allWordListsLatKey.length);
//                         allWordListsLongKey = Object.keys(allWordLists[allWordListsLatKey[randomLat]]);
//                         let randomLong = Math.floor(Math.random()*allWordListsLongKey.length);
//                         dictionary = allWordLists[allWordListsLatKey[randomLat]][allWordListsLongKey[randomLong]];
//                         wordList = shuffleArray(Object.keys(dictionary));
//                         callback();
//                     })
//                 }
//             });
//         });
//     } else {
//         console.log("Geolocation is not supported by this browser.");
//     }
// }

function initializeGame(callback) {
  questionNumber = 0;
  score = 0;
  currentQuestion = null;
  currentGame = new game();
  isEnd = false;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = processGeovalue(position.coords.latitude);
      long = processGeovalue(position.coords.longitude);
      console.log(lat);
      console.log(long);
      getAllWordLists().then(function(result){
        allWordLists = result.val();
        if(allWordLists[lat][long] !== null && allWordLists[lat][long] !== undefined){
          dictionary = allWordLists[lat][long];
        }else{
          allWordListsLatKey = Object.keys(allWordLists);
          let randomLat = Math.floor(Math.random()*allWordListsLatKey.length);
          console.log('get random lat');
          allWordListsLongKey = Object.keys(allWordLists[allWordListsLatKey[randomLat]]);
          let randomLong = Math.floor(Math.random()*allWordListsLongKey.length);
          console.log('get random long');
          dictionary = allWordLists[allWordListsLatKey[randomLat]][allWordListsLongKey[randomLong]];
        }
        wordList = shuffleArray(Object.keys(dictionary));
        console.log('before callback');
        callback();
      });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function shuffleArray(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [
      a[i - 1],
      a[j]
    ] = [
      a[j],
      a[i - 1]
    ];
  }
  return a;
}

function getNextQuestion() {
  if (isEnd)
    return {isEnd: true};
  var no_answer = false;
  var yes_answer = true;
  var random = questionNumber;
  if (Math.random() >= 0.8 && wordList.length > 1) {
    while (true) {
      random = Math.floor(Math.random() * wordList.length);
      if (random != questionNumber)
        break;
      }
    no_answer = true;
    yes_answer = false;
  }
  let correctWord = wordList[questionNumber];
  let questionWord = wordList[random];
  let imageUrl = dictionary[wordList[questionNumber]]['imageUrl'][Math.floor(Math.random() * dictionary[wordList[questionNumber]]['imageUrl'].length)];
  let definition = dictionary[wordList[questionNumber]]['definition'];
  currentQuestion = new question(correctWord, questionWord, imageUrl, false, definition);

  let question_obj = {
    question_picture: imageUrl,
    question_line: "Is this <strong>" + questionWord + "</strong>?",
    no_button: no_answer,
    yes_button: yes_answer
  };
  return question_obj;
}

function displayQuestion() {
  var no_answer = false;
  var yes_answer = true;
  var random = questionNumber;
  if (Math.random() >= 0.8) {
    while (true) {
      random = Math.floor(Math.random() * wordList.length);
      if (random != questionNumber)
        break;
      }
    no_answer = true;
    yes_answer = false;
  }
  let correctWord = wordList[questionNumber];
  let questionWord = wordList[random];
  let imageUrl = dictionary[wordList[questionNumber]]['imageUrl'][Math.floor(Math.random() * dictionary[wordList[questionNumber]]['imageUrl'].length)];
  let definition = dictionary[wordList[questionNumber]]['definition'];
  currentQuestion = new question(correctWord, questionWord, imageUrl, false, definition);
  document.getElementById("question_picture").src = imageUrl;
  document.getElementById("question_line").innerHTML = "Is this <strong>" + questionWord + "</strong>?";
  document.getElementById("no_button").setAttribute("onclick", "nextQuestion(" + no_answer + ")");
  document.getElementById("yes_button").setAttribute("onclick", "nextQuestion(" + yes_answer + ")");
}

function checkAnswer(answer) {
  return new Promise((resolve, reject) => {
    if (isEnd) {
      reject("Game is end!");
      return;
    }
    currentQuestion.correct = answer;
    currentGame.addQuestion(currentQuestion);
    if (answer) {
      score++;
    }
    if (questionNumber === wordList.length - 1) {
      isEnd = true;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                saveGame(currentGame, user.uid);
            } else {
                // No user is signed in.
                console.log('user not signed in. game is not saved');
            }
        });

    } else {
      questionNumber++;
    }
    let current_status = {
      score: score,
      isEnd: isEnd
    }
    resolve(current_status);
  });
}

function nextQuestion(answer) {
  currentQuestion.correct = answer;
  currentGame.addQuestion(currentQuestion);
  if (answer) {
    score++;
  }
  if (questionNumber === wordList.length) {
    //end of game display score
    console.log('end of game');
    console.log('you got: ' + score);
    saveGame(currentGame, 'usertest');
    return;
  }
  displayQuestion();
  questionNumber++;
}
