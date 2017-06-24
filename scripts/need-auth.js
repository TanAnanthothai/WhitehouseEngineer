var user = firebase.auth().currentUser;

if (user) {
  // Do it!
} else {
  window.location = '/index.html';
}
