const CACHE_NAME = 'score-predict-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event with Stale-While-Revalidate caching strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response, then fetch fresh in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => { /* Ignore offline fetch errors */ });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

// Background Sync (for offline support / resilient actions)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-predictions') {
    console.log('[Service Worker] Sincronizando predicciones guardadas offline...');
    event.waitUntil(
      // Simular sincronización exitosa de datos
      Promise.resolve({ status: 'synchronized' })
    );
  }
});

// Periodic Background Sync (to update matches schedules/scores in background)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-scores') {
    console.log('[Service Worker] Actualizando marcadores del Mundial en segundo plano...');
    event.waitUntil(
      fetch('/api/health') // o un endpoint de fallback
        .then((response) => response.json())
        .then((data) => console.log('[Service Worker] Datos actualizados:', data))
        .catch((err) => console.warn('[Service Worker] Error de sincronización periódica:', err))
    );
  }
});

// Push Notifications (Re-engage users)
self.addEventListener('push', (event) => {
  let data = { title: '2026 FIFA Score Predict', body: '¡Hay nuevas simulaciones disponibles para el Mundial!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: '2026 FIFA Score Predict', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      primaryKey: 1,
      url: '/'
    },
    actions: [
      { action: 'explore', title: 'Ver Partidos', icon: '/icon-192.png' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;

  notification.close();

  if (action === 'explore') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});
