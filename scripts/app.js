(function() {
  'use strict';
  // Comment for error no google-cloud/debug-agent
  // require('@google-cloud/debug-agent').start({ allowExpressions: true });

  const messaging = firebase.messaging();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function(registration) {
        messaging.useServiceWorker(registration);
        console.log('Service Worker Registered');
        console.log(registration);
      });
  }
})();
