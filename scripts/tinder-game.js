var wordList = '';
var dictionary = '';
var question = 0;
var score = 0;

function initializeGame(){
    question = 0;
    score = 0;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getWords(lat, long).then(function(words){
                dictionary = words.val();
                wordList = shuffleArray(Object.keys(dictionary));
                displayQuestion();
                question++;
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
    var random = question;
    if(Math.random() >= 0.8){
        while(true){
            random = Math.floor(Math.random()*wordList.length);
            if(random != question)
                break;
        }
        no_answer = true;
        yes_answer = false;
    }
    document.getElementById("question_picture").src = dictionary[wordList[question]]['imageUrl'][Math.floor(Math.random()*dictionary[wordList[question]]['imageUrl'].length)];
    document.getElementById("question_line").innerHTML = "Is this <strong>" + wordList[random] + "</strong>";
    document.getElementById("no_button").setAttribute("onclick", "nextQuestion("+no_answer+")");
    document.getElementById("yes_button").setAttribute("onclick", "nextQuestion("+yes_answer+")");
}

function nextQuestion(answer){
    if(answer){
        score++;
    }
    if(question === wordList.length){
        //end of game display score
        console.log('end of game');
        console.log('you got: ' + score);
        return;
    }
    displayQuestion();
    question++;
}