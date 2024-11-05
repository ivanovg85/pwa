var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event) {
    console.log('SW installed');
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function(cache) {
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/main.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/main.css',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
            })
    );
});

self.addEventListener('activate', function(event) {
    console.log('SW activated');
    event.waitUntil(
        caches.keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('SW Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                    .then(function(res) {
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then(function(cache) {
                                // cache.put(event.request.url, res.clone());
                                return res;
                            });
                    });
                }
            })
    );
});