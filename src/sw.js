/* eslint-disable no-undef */
// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
require('regenerator/runtime');
require('serviceworker-cache-polyfill');

const version = '24';
const prefix = 'almondoffline';
const staticCacheName = `${prefix}-static-v${version}`;

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/',
        '/water-cycles',
      ]).then(() => cache.match('/shell.html')).then(response => {
        return response.text().then(text => {
          const headerEnd = text.indexOf('<div class="article-header subheading">');
          const articleEnd = text.indexOf('<div class="background-load-offer card">');
          return Promise.all([
            cache.put('/shell-start.html', new Response(text.slice(0, headerEnd), response)),
            cache.put('/shell-end.html', new Response(text.slice(articleEnd), response))
          ]);
        });
      });
    })
  );
});

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.tag || '/water-cycles';
  e.waitUntil(self.clients.openWindow(`${url}`));
});

self.addEventListener('push', e => {
  const data = e.data.json();
  const { title, body, tag } = data;
  self.registration.showNotification(title, {
    body: body,
    icon: 'https://i.ibb.co/5k2ygmV/favicon.png',
    tag: tag,
  });
});

workbox.routing.registerRoute(
  new RegExp('.css$'),
  workbox.strategies.cacheFirst({
    cacheName: 'poc-cache-Stylesheets',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // cache for one week
        maxEntries: 20, // only cache 20 request
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate(),
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.cacheFirst({
    cacheName: 'poc-cache-Images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        maxEntries: 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  RegExp('https://res.cloudinary.com/almondgreen/raw/upload/v1569408169/Almond/styles/globals_h6bbjb.css'),
  new workbox.strategies.CacheFirst({
    cacheName: 'google-material-css',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  RegExp('https://cdn.jsdelivr.net/gh/mailtoharshit/San-Francisco-Font-/sanfrancisco.css'),
  new workbox.strategies.CacheFirst({
    cacheName: 'SF stylesheet',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /^https:\/\/almond-api\.herokuapp\.com\api/,
  new workbox.strategies.staleWhileRevalidate({
    cacheName: 'poc-cache-employees',
    cacheExpiration: {
      maxAgeSeconds: 60 * 60, //cache for 60mn
    },
  }),
);

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute('/', workbox.strategies.networkFirst());
workbox.precaching.precacheAndRoute(self.__precacheManifest);