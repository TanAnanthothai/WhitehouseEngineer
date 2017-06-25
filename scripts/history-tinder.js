$(document).ready(function(event) {
  // You can also use the client directly in your browser:
  var app = new Clarifai.App(
    '7vUAZICe2NYc1HjYJq2U56E4BWpWK1K20uCO0hLQ',
    'Ye3nlx_hp8Bo1e5QfVVZUMmQ9qNmfjIbDtKS3ebL'
  );

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
  var clarifai = '';
  var clarifai_word = '';

  var listHistory = function(userID) {
    window.localforage.getItem(userID, function(err, gameHistory) {
      questionHistory = gameHistory[key]['questions'];
      // console.log(gameHistory[key]['questions']);
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
        // console.log(Math.round(this.endX));
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
    clarifai_word = '';
    // console.log(questionHistory[i]);
    if (i < u || typeof questionHistory[i] !== 'undefined') {
      $("div.content").prepend('<div class="photo" id="photo" style="background-image:url(' + questionHistory[i]['imageUrl'] + ')"></div>');
      $(".question").html('Is this <strong><u>' + questionHistory[i]['questionWord'] + '</u></strong>?');

      if (questionHistory[i]['correct']) {
        $("#correct").html('<img src="/images/yes-icon.png" alt="Your answer is correct" />');
      } else {
        $("#correct").html('<img src="/images/no-icon.png" alt="Your answer is wrong" />');
      }

      $("#correct-word").html(questionHistory[i]['correctWord']);

      if (questionHistory[i]['definition'] == "") {
        clarifaiUp(questionHistory[i]['imageUrl']).then(function(clarifai) {
          // console.log(clarifai);
          console.log(clarifai['rawData']['outputs'][0]['data']['concepts']);

          clarifai_data = clarifai['rawData']['outputs'][0]['data']['concepts'];

          for (var i = 0; i < clarifai_data.length; i++) {
            console.log(clarifai_data[i]['name'] + ' : ' + clarifai_data[i]['value']);

            if (clarifai_data[i]['value'] >= 0.9) {
              clarifai_word += clarifai_data[i]['name'] + ', ';
            }
          }
          $("#definition").html(clarifai_word);
          // console.log(clarifai_word);
        });
      } else {
        definition = questionHistory[i]['definition'];
        $("#definition").html(definition);
      }

      swipe();
    } else {
      console.log("END");
      $(".question").html('WOW?  <strong>Your skill UP!</strong>');
      $("#footer-history").html('<div class="container"><a href="/tinder.html"><button type="button" class="btn btn-outline-success text-center">PLAY MORE</button></a></div>');
    }
    i++;
  }

  // predict the contents of an image by passing in a url
  function clarifaiUp(image) {
    return new Promise(function(result) {
      app.models.predict(Clarifai.GENERAL_MODEL, image).then(
        function(response) {
          // console.log(response);
          if (response.status.code == 10000) {
            console.log('Successfully');
          }
          result(response);
        },
        function(err) {
          console.error(err);
        }
      );
    });
  }

});
