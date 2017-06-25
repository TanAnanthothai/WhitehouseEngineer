firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    listHistory(user.uid)
  } else {
    // No user is signed in.
  }
});

var listHistory = function(userID) {
  window.localforage.getItem(userID, function(err, gameHistory) {
    gameHistory; //array of game object (look in game.js)
    console.log(gameHistory);

    x = 1;
    if (gameHistory != null && Object.keys(gameHistory).length > 0) {
      for (var i = Object.keys(gameHistory).length - 1; i >= 0; i--) {
        console.log("i = " + i);
        var date = new Date(gameHistory[i]['timestamp']);
        console.log(timeSince(date));
        // var datetime = convertTime(gameHistory[i]['timestamp'], '/');

        x = x + i;
        var innerDiv = document.getElementById('container-history');
        // innerDiv.appendChild("TEST");
        var line = document.createElement("p");
        line.innerHTML = `<a href="/history-vocab.html?key=` + i + `"><div class="card">
          <h4 class="card-title" style="margin-bottom: 0;">Game # ` + x + `
            <span class="mb-2 text-muted pull-right">score ` + gameHistory[i]['score'] + `/` + gameHistory[i]['fullScore'] + `</span>
          </h4>
          <p class="card-text" style="margin-bottom: 0;">make up the bulk of the card's content.</p>
          <span><span class="pull-right">` + timeSince(date) + `</span></span>
      </div></a>`;
        innerDiv.appendChild(line);
      }
    }

  })
}

var convertTime = function(timestamp, separator) {
  var pad = function(input) {
    return input < 10 ? "0" + input : input;
  };
  var date = timestamp ? new Date(timestamp) : new Date();
  var d = new Date()
  console.log(date.getHours() + "hahah");
  return [
    pad(date.getDate()),
    pad(date.getMonth()),
    pad(date.getFullYear())
  ].join(typeof separator !== 'undefined' ? separator : ':');
}

var DURATION_IN_SECONDS = {
  epochs: ['year', 'month', 'day', 'hour', 'minute'],
  year: 31536000,
  month: 2592000,
  day: 86400,
  hour: 3600,
  minute: 60
};

function getDuration(seconds) {
  var epoch, interval;
  for (var i = 0; i < DURATION_IN_SECONDS.epochs.length; i++) {
    epoch = DURATION_IN_SECONDS.epochs[i];
    interval = Math.floor(seconds / DURATION_IN_SECONDS[epoch]);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: epoch
      };
    }
  }
};

function timeSince(date) {
  var seconds = Math.floor((new Date() - new Date(date*1000)) / 1000);
  var duration = getDuration(seconds);
  var suffix = (duration.interval > 1 || duration.interval === 0) ? 's' : '';
  return duration.interval + ' ' + duration.epoch + suffix;
};
