// Service Worker for PMI Posko App
const CACHE_NAME = 'pmi-posko-v1.0.0'
const STATIC_CACHE = 'pmi-posko-static-v1.0.0'
const DYNAMIC_CACHE = 'pmi-posko-dynamic-v1.0.0'
const API_CACHE = 'pmi-posko-api-v1.0.0'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  // Note: /offline and /manifest.json are not cached to avoid errors
  // CSS and JS bundles will be added automatically during runtime
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/dashboard-stats',
  '/api/users',
  '/api/weather',
  '/api/incidents',
  '/api/vehicles',
  '/api/blood-stock',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    Promise.all([
      // Cache static assets with error handling
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets')
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(error => {
              console.log('Service Worker: Failed to cache', url, error)
              // Continue with other assets even if one fails
            })
          )
        )
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Default fetch for other requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
      })
  )
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for API:', request.url)
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  // Return offline response for critical APIs
  if (API_ENDPOINTS.some(endpoint => request.url.includes(endpoint))) {
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Data tidak tersedia saat offline. Pastikan koneksi internet Anda aktif.',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // Return network error for non-critical APIs
  return new Response(
    JSON.stringify({ error: 'Network Error', message: 'Tidak dapat terhubung ke server' }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset:', request.url)
    // Return a placeholder for images
    if (request.destination === 'image') {
      return new Response('', { status: 404 })
    }
    return new Response('Asset not available offline', { status: 503 })
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Navigation failed, showing offline page')

    // Show offline page
    const cache = await caches.open(STATIC_CACHE)
    const offlineResponse = await cache.match('/offline')

    if (offlineResponse) {
      return offlineResponse
    }

    // Fallback offline response
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - PMI Posko</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center;
              padding: 50px;
              background: #f5f5f5;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #dc2626; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
            .retry-btn {
              background: #dc2626;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔴 Offline</h1>
            <p>Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</p>
            <p>Silakan periksa koneksi internet Anda dan coba lagi.</p>
            <button class="retry-btn" onclick="window.location.reload()">Coba Lagi</button>
          </div>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered')

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync')
  // Implement background sync logic here
  // This could retry failed API requests
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')

  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/images/logo pmi-tangsel.png',
      badge: '/images/logo pmi-tangsel.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard'
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'PMI Posko Alert', options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/dashboard')
  )
})

// Periodic background sync (for future use)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent())
  }
})

async function syncContent() {
  console.log('Service Worker: Periodic content sync')
  // Implement periodic sync logic here
  // Could refresh cached data in background
}
