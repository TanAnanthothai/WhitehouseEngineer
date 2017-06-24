$(document).ready(function(event) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      listHistory(user.uid)
    } else {
      // No user is signed in.
    }
  });

  var url = new URL(window.location);
  var key = url.searchParams.get("key");
  var i = 0;
  var u = 0;
  var questionHistory = '';

  var listHistory = function(userID) {
    window.localforage.getItem(userID, function(err, gameHistory) {
      questionHistory = gameHistory[key]['questions'];
      console.log(gameHistory[key]['questions']);
      u = gameHistory[key]['questions'].length;
      addNewQuestion();
    });
  };

  $("div#swipe_like").on("click", function() {
    swipeLike();
  });

  $("div#swipe_dislike").on("click", function() {
    swipeDislike();
  });

  function swipe() {
    Draggable.create("#photo", {
      throwProps: true,
      onDragEnd: function(endX) {
        if (Math.round(this.endX) > 0) {
          swipeLike();
        } else {
          swipeDislike();
        }
        console.log(Math.round(this.endX));
      }
    });
  }

  function swipeLike() {
    var status = $("div#swipe_like").data('status');
    var $photo = $("div.content").find('#photo');

    var swipe = new TimelineMax({
      repeat: 0,
      yoyo: false,
      repeatDelay: 0,
      onComplete: remove,
      onCompleteParams: [$photo]
    });
    swipe.staggerTo($photo, 0.8, {
      bezier: [{
        left: "+=400",
        top: "+=300",
        rotation: "60"
      }],
      ease: Power1.easeInOut
    });

    addNewQuestion();
  }

  function swipeDislike() {
    var status = $("div#swipe_dislike").data('status');
    var $photo = $("div.content").find('#photo');

    var swipe = new TimelineMax({
      repeat: 0,
      yoyo: false,
      repeatDelay: 0,
      onComplete: remove,
      onCompleteParams: [$photo]
    });
    swipe.staggerTo($photo, 0.8, {
      bezier: [{
        left: "+=-350",
        top: "+=300",
        rotation: "-60"
      }],
      ease: Power1.easeInOut
    });
    addNewQuestion();
  }

  function remove(photo) {
    $(photo).remove();
  }

  function addNewQuestion() {
    console.log(questionHistory[i]);
    if (i < u) {
      $("div.content").prepend('<div class="photo" id="photo" style="background-image:url(' + questionHistory[i]['imageUrl'] + ')"></div>');
      $(".question").html(questionHistory[i]['questionWord']);

      var footerHistory = document.getElementById('footer-history');
      var line = document.createElement("p");
      line.innerHTML = 'CORRECT WORD :: '+questionHistory[i]['correctWord'] + '<br>';
      line.innerHTML += 'DEFINITION :: '+questionHistory[i]['definition'] + '<br>'
      footerHistory.appendChild(line);

      swipe();
    }
    i++;
  }
});
