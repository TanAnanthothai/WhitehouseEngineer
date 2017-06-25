var handleSignOut = function () {
  document.getElementById('sign-out').addEventListener('click', function() {
    document.getElementById('go-leaderboard').style.display = 'none';
    document.getElementById('sign-out').style.display = 'none';
    firebase.auth().signOut();
  });
}

var handleSignedIn = function (user) {
  user.getToken().then(function(accessToken) {
    var jsonData = JSON.stringify({
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      uid: user.uid,
      accessToken: user.accessToken,
      providerData: user.providerData
    }, null, '  ');
    console.log(jsonData);
    document.getElementById('go-leaderboard').style.display = 'block';
    document.getElementById('sign-out').style.display = 'block';
    handleSignOut();
  });
};

var handleNotSignedIn = function () {
  var uiConfig = {
    signInSuccessUrl: '/history.html',
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    tosUrl: '/index.html?term=on'
  };
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig);
};


initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      handleSignedIn(user);
    } else {
      handleNotSignedIn();
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp();
});
