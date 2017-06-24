$(function() {
  getLocation();
  getImageFromCamera();
});

var position_latitude = '';
var position_longitude = '';
var image_path = '';

function submitOnClick() {
  console.log("on click submit");
  var getImage = $('input[name="image"]').val();
  var getVocal = $('input[name="vocab"]').val();
  // File or Blob named mountains.jpg
  var file = $('input[name="image"]').get(0).files.item(0);

  uploadImage(file).then(function() {
    insertData('USER01', getVocal, image_path, position_latitude, position_longitude);
  });

}

function getImageFromCamera() {
  var video = document.getElementById('video');

  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          video.src = window.URL.createObjectURL(stream);
          video.play();
      });
  }

  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
  	context.drawImage(video, 0, 0, 200, 200);
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      position_latitude = position.coords.latitude;
      position_longitude = position.coords.longitude;
      $('#currentLocation').html(`
        <p>Latitue: ${position_latitude}</p>
        <p>Longitude: ${position_longitude}</p>
      `);
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function uploadImage(file) {
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
      console.log(downloadURL);
      image_path = downloadURL;
      path(downloadURL);
    });
  });
}

function insertData(user, vocab, image, latitude, longitude) {
  latitude = latitude * 1000;
  longitude = longitude * 1000;
  var firebaseRef = firebase.database().ref("words/" + latitude);
  firebaseRef.push({
    user: user,
    vocab: vocab,
    image: image,
    latitude: latitude,
    longitude: longitude
  });
  console.log("Insert Success!");
}
