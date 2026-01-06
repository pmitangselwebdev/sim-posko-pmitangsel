'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register service worker in production and if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New service worker version available')
                  // You could show a notification to the user here
                  if (confirm('Versi baru aplikasi tersedia. Perbarui sekarang?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Handle controller change (when SW takes control)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed')
            // Optional: reload the page when SW takes control
            // window.location.reload()
          })

        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // Listen for online/offline events
      window.addEventListener('online', () => {
        console.log('App is online')
        // You could show a notification or sync pending data here
      })

      window.addEventListener('offline', () => {
        console.log('App is offline')
        // You could show an offline notification here
      })
    }
  }, [])

  return null // This component doesn't render anything
}
