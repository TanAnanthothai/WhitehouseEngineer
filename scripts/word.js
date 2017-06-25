function submitWord(file, word, lat, long, definition = '') {
  $('#cssload-pgloading').show();
    return new Promise(function (result) {
            if (typeof file == "string") {
                uploadImageBlob(file).then(function (imageUrl) {
                    addWord(word, lat, long, imageUrl, definition);
                    $('#cssload-pgloading').hide();
                });
            } else {
                uploadImageT(file).then(function (imageUrl) {
                    addWord(word, lat, long, imageUrl, definition);
                    $('#cssload-pgloading').hide();
                });
            }
            result();
        }
    );
}

/**
 *
 * @param word
 * @param definition
 * @param lat
 * @param long
 * @param imageUrl
 */
function addWord(word, lat, long, imageUrl, definition = ''){
    return new Promise(function(result){
        let latitude = processGeovalue(lat);
        let longitude = processGeovalue(long);
        firebase.database().ref('words/' + latitude + '/' + longitude + '/' + word).transaction(function(currentWord){
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
        });
        result();
    });
}

function processGeovalue(value){
    return Math.round(value*1000);
}

/**
 * upload image file to the firebase storage
 * @param file : image file
 * @returns {Promise}
 */
function uploadImageT(file) {
    return new Promise(function(path) {

        // Create a root reference
        var storageRef = firebase.storage().ref('vocabularies');

        // Create the file metadata
        var metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child(file.name).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        2
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            function(error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = uploadTask.snapshot.downloadURL;
                $('#correct_icon_img').show();
                console.log(downloadURL);
                image_path = downloadURL;
                path(downloadURL);
            });
    });
}

function uploadImageBlob(file) {
    return new Promise(function (path) {

        var filename = new Date().getTime();
        // Create a root reference
        var storageRef = firebase.storage().ref('vocabularies/' + filename +'.jpg');

        // Create the file metadata
        var metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.putString(file, 'base64', metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        2
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            function (error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            function () {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = uploadTask.snapshot.downloadURL;
                console.log(downloadURL);
                image_path = downloadURL;
                path(downloadURL);
            });
    });
}

function getWords(lat, long){
    let latitude = processGeovalue(lat);
    let longitude = processGeovalue(long);
    return firebase.database().ref('words/' + latitude + '/' + longitude).once('value');
}

function getAllWordLists(){
    return firebase.database().ref('words/').once('value');
}
