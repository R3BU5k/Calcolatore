const cacheName = 'cache-v3.00';
const resourcesToPrecache = [
    '/',
    'index.html',
    'js/app.js',
    'js/cookies.js',
    'js/theme.js',
    'js/calculator.js',
    'js/ui.js',
    'manifest.json', 
    'images/logo.ico',
    'images/logo192.png',
    'styles/light.css',
    'styles/dark.css',
    'images/theme.png',
    'icons/browserconfig.xml'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(resourcesToPrecache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== cacheName).map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
