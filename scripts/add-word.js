$(function() {
  getLocation();
  getImageFromCamera();
});

var position_latitude = '';
var position_longitude = '';
var image_path = '';
var localstream = '';

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

function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
        'microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' +
        (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Found ome other kind of source/device: ', deviceInfo);
    }
  }
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
      localstream = stream;
      video.play();
    });
  }

  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
    // context.drawImage(video, 0, 0, 100, 200);
    canvas.style.display = 'block';
    context.drawImage(video, 0, 0, 300, 300)
    video.pause();
    video.src = "";
    video.style.display = "none";
    localstream.getTracks()[0].stop();
    this.style.display = 'none';
    document.getElementById("re-snap").style.display = 'block';
  });
}

document.getElementById("re-snap").addEventListener("click", function() {
  video.style.display = "block";
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('show-image').style.display = 'none';
  this.style.display = 'none';
  document.getElementById("snap").style.display = 'block';
  getImageFromCamera();
});

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
