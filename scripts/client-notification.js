const messaging = firebase.messaging();
var currentUserUid;

function writeNotificationDatabase(userId, token) {
  firebase.database().ref('notification/' + token).set({
    date: Math.floor(Date.now() / 1000)
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUserUid = user.uid;
    console.log(currentUserUid);
  }
}, function(error) {
  console.log(error);
});

messaging.requestPermission()
  .then(function() {
    console.log('Notification permission granted.');
  })
  .catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });

messaging.getToken()
  .then(function(currentToken) {
    if (currentToken) {
      console.log(currentToken);
      console.log(currentUserUid);
      writeNotificationDatabase(
        currentUserUid,
        currentToken
      );
    } else {
      console.log('No Instance ID token available. Request permission to generate one.');
    }
  })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
  });

messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token refreshed.');
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
  // const notificationTitle = 'Background Message Title';
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: '/firebase-logo.png'
  // };
  //
  // return self.registration.showNotification(notificationTitle,
  //     notificationOptions);
});
