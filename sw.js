self.addEventListener('install', function(e) {
  e.waitUntil(caches.open('airhorner').then(function(cache) {
    return cache.addAll([
      '/',
      '/index.html',
      '/leaderboard.html',
      '/images/ic_add_white_24px.svg',
      '/images/ic_refresh_white_24px.svg',
      '/styles/global.css',
      '/styles/login.css',
      '/styles/leaderboard.css',
      '/styles/ud811.css',
      '/scripts/app.js',
      '/scripts/need-auth.js',
    ]);
  }));
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(caches.match(event.request).then(function(response) {
    return response || fetch(event.request);
  }));
});
