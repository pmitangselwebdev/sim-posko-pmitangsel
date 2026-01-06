'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  className = '',
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority) // Load immediately if priority
  const imgRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Generate WebP/AVIF sources for modern browsers
  const generateSources = (src) => {
    if (!src || typeof src !== 'string') return []

    const sources = []

    // AVIF for modern browsers (best compression)
    if (src.startsWith('/')) {
      sources.push({
        srcSet: `${src}?format=avif&w=400 400w, ${src}?format=avif&w=800 800w, ${src}?format=avif&w=1200 1200w`,
        type: 'image/avif'
      })
    }

    // WebP for good compression
    if (src.startsWith('/')) {
      sources.push({
        srcSet: `${src}?format=webp&w=400 400w, ${src}?format=webp&w=800 800w, ${src}?format=webp&w=1200 1200w`,
        type: 'image/webp'
      })
    }

    return sources
  }

  // Don't render anything if not in view (lazy loading)
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 dark:bg-gray-800 animate-pulse ${className}`}
        style={{ width, height }}
        {...props}
      />
    )
  }

  // Show error state
  if (hasError) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 ${className}`}
        style={{ width, height }}
        {...props}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  const sources = generateSources(src)

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* Picture element for modern formats */}
      {sources.length > 0 ? (
        <picture>
          {sources.map((source, index) => (
            <source key={index} srcSet={source.srcSet} type={source.type} />
          ))}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            quality={quality}
            priority={priority}
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </picture>
      ) : (
        // Fallback for external images
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Hook for lazy loading multiple images
export function useLazyImageLoader() {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [loadingImages, setLoadingImages] = useState(new Set())

  const preloadImage = (src) => {
    if (!src || loadedImages.has(src) || loadingImages.has(src)) return

    setLoadingImages(prev => new Set(prev).add(src))

    const img = new Image()
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(src))
      setLoadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(src)
        return newSet
      })
    }
    img.onerror = () => {
      setLoadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(src)
        return newSet
      })
    }
    img.src = src
  }

  const isLoaded = (src) => loadedImages.has(src)
  const isLoading = (src) => loadingImages.has(src)

  return { preloadImage, isLoaded, isLoading }
}
