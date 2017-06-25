const messaging = firebase.messaging();

messaging.requestPermission()
  .then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // ...
  })
  .catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });

messaging.getToken()
  .then(function(currentToken) {
    if (currentToken) {
      console.log(currentToken);
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
