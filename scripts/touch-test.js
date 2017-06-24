function loadGame(){
    firebase.database().ref('words').once('value').then(function(snapshot){
        startGame(snapshot.val());
    });
}

function startGame(words){
    keys = Object.keys(words);
    keys = shuffle(keys);
    for(i = 0; i < keys.length; i++){
        console.log(words[keys[i]])
    }
}

function random(start, end){
    return Math.floor(Math.random()*(end-start)) + start;
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

function insertWord(word, definition, lat, long, imageUrl){
    let word = 'deejay';
    let definition = 'ดีเจ';
    let longitude = '103928.10392';
    let latitude = '102842.1382';
    let imageUrl = 'something2.jpg';

    firebase.database().ref('words/' + word).transaction(function(currentWord){
        if(currentWord === null){
            return {
                word: word,
                definition: definition,
                longitude: longitude,
                latitude: latitude,
                imageUrl: [imageUrl]
            };
        }else{
            currentWord.imageUrl.push(imageUrl);
            return currentWord;
        }
    });/**
     * Created by Tou-ChI on 24/6/2560.
     */
}
