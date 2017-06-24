checkAuth = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // console.log('pass');
    } else {
      window.location = '/index.html';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  checkAuth();
});
