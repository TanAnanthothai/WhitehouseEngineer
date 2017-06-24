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

  if (!file) {
    console.log("have no file");
    var canvas = document.getElementById('canvas');
    var dataURL = canvas.toDataURL();
    b64Text = dataURL.replace('data&colon;image/png;base64,','');
    file = b64Text.substring(22);
    console.log("BASE64 " + file);
  }
  submitWord(file, getVocal, position_latitude, position_longitude)

}

function getImageFromCamera() {
  var video = document.getElementById('video');

  // Get access to the camera!
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(function(stream) {
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
    alert("Geolocation is not supported by this device.");
  }
}
