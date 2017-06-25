
(function() {
  'use strict';
  // Comment for error no google-cloud/debug-agent
  // require('@google-cloud/debug-agent').start({ allowExpressions: true });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function() {
        console.log('Service Worker Registered');
      });
  }
})();
