$(document).ready(function(event) {
  initializeGame(addNewQuestion);

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
    $(".question").html('<div class="loading-text"></div>');
    var status = $("div#swipe_like").data('status');
    checkAnswer(status).then(function(current_game_status) {
      console.log(current_game_status);
      var $photo = $("div.content").find('#photo');

      var swipe = new TimelineMax({repeat: 0, yoyo: false, repeatDelay: 0, onComplete: remove, onCompleteParams: [$photo]});
      swipe.staggerTo($photo, 0.8, {
        bezier: [
          {
            left: "+=400",
            top: "+=300",
            rotation: "60"
          }
        ],
        ease: Power1.easeInOut
      });

      addNewQuestion();
    }, function(error) {
      console.log(error);
    });
  }

  function swipeDislike() {
    $(".question").html('<div class="loading-text"></div>');
    var status = $("div#swipe_dislike").data('status');
    checkAnswer(status).then(function(current_game_status) {
      console.log(current_game_status);
      var $photo = $("div.content").find('#photo');

      var swipe = new TimelineMax({repeat: 0, yoyo: false, repeatDelay: 0, onComplete: remove, onCompleteParams: [$photo]});
      swipe.staggerTo($photo, 0.8, {
        bezier: [
          {
            left: "+=-350",
            top: "+=300",
            rotation: "-60"
          }
        ],
        ease: Power1.easeInOut
      });

      addNewQuestion(current_game_status.isNextLast);
    }, function(error) {
      console.log(error);
    });
  }

  function remove(photo) {
    $(photo).remove();
  }

  function updateGameProgress(currentGame, fullScore) {
    currentGame.question
  }

  function addNewQuestion() {
    var question = getNextQuestion();
    if (question.isEnd) {
      console.log('Game End!');
      return;
    }
    // updateGameProgress(question.currentGame, question.fullScore);
    $("div.content").prepend('<div class="photo" id="photo" style="background-image:url(' + question.question_picture + ')"></div>');
    $(".question").html(question.question_line);
    $("div#swipe_like").data('status', question.yes_button);
    $("div#swipe_dislike").data('status', question.no_button);
    swipe();
  }

});
