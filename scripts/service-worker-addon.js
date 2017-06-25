importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

var config = {
  apiKey: "AIzaSyDt8s0P86mowfGRVCJq8UqxQKFQQR2XTjk",
  authDomain: "whitehouseengineer.firebaseapp.com",
  databaseURL: "https://whitehouseengineer.firebaseio.com",
  projectId: "whitehouseengineer",
  storageBucket: "whitehouseengineer.appspot.com",
  messagingSenderId: "748101989536"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[SW] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
