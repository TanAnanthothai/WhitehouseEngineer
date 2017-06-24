var wordList = '';
var dictionary = '';
var questionNumber = 0;
var score = 0;
var currentQuestion;
var currentGame;

function initializeGame(){
    questionNumber = 0;
    score = 0;
    currentQuestion = null;
    currentGame = new game();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getWords(lat, long).then(function(words){
                dictionary = words.val();
                wordList = shuffleArray(Object.keys(dictionary));
                displayQuestion();
                questionNumber++;
            });
        });
    } else {
       console.log("Geolocation is not supported by this browser.");
    }

}

function shuffleArray(a){
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

function displayQuestion(){
    var no_answer = false;
    var yes_answer = true;
    var random = questionNumber;
    if(Math.random() >= 0.8){
        while(true){
            random = Math.floor(Math.random()*wordList.length);
            if(random != questionNumber)
                break;
        }
        no_answer = true;
        yes_answer = false;
    }
    let correctWord = wordList[questionNumber];
    let questionWord = wordList[random];
    let imageUrl = dictionary[wordList[questionNumber]]['imageUrl'][Math.floor(Math.random()*dictionary[wordList[questionNumber]]['imageUrl'].length)];
    let definition = dictionary[wordList[questionNumber]]['definition'];
    currentQuestion = new question(correctWord, questionWord, imageUrl, false, definition);
    document.getElementById("question_picture").src = imageUrl;
    document.getElementById("question_line").innerHTML = "Is this <strong>" + questionWord + "</strong>";
    document.getElementById("no_button").setAttribute("onclick", "nextQuestion("+no_answer+")");
    document.getElementById("yes_button").setAttribute("onclick", "nextQuestion("+yes_answer+")");
}

function nextQuestion(answer){
    currentQuestion.correct = answer;
    currentGame.addQuestion(currentQuestion);
    if(answer){
        score++;
    }
    if(questionNumber === wordList.length){
        //end of game display score
        console.log('end of game');
        console.log('you got: ' + score);
        saveGame(currentGame, 'usertest');
        return;
    }
    displayQuestion();
    questionNumber++;
}