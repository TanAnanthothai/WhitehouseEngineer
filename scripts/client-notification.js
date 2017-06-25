const messaging = firebase.messaging();

function writeNotificationDatabase(userId, token) {
  firebase.database().ref('notification/' + userId).set({
    token: token
  });
}

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
      writeNotificationDatabase(
        firebase.auth().currentUser.uid,
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
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icons/icon-512x512.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
