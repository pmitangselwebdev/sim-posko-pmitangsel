"use client"

import { useState, useEffect } from 'react'

export default function Weather() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/weather')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch weather data')
        }
        return res.json()
      })
      .then(data => {
        setWeather(data)
      })
      .catch(err => {
        console.error('Weather fetch error:', err)
        setError(err.message)
        // Set fallback data
        setWeather({
          temperature: '25',
          humidity: '70',
          windSpeed: '10',
          weatherDesc: 'Cerah'
        })
      })
  }, [])

  // Function to get weather icon based on description
  const getWeatherIcon = (desc) => {
    const descLower = desc.toLowerCase()
    if (descLower.includes('cerah')) return '☀️'
    if (descLower.includes('berawan')) return '☁️'
    if (descLower.includes('hujan')) return '🌧️'
    if (descLower.includes('petir')) return '⛈️'
    if (descLower.includes('kabut')) return '🌫️'
    return '🌤️'
  }

  if (error) {
    return (
      <div className="text-center space-y-2">
        <div className="text-4xl">{getWeatherIcon(weather?.weatherDesc || 'Cerah')}</div>
        <div className="text-lg font-bold text-blue-800">{weather?.temperature}°C</div>
        <div className="text-sm text-blue-600">{weather?.weatherDesc}</div>
        <div className="flex justify-around text-xs text-blue-700 mt-2">
          <div className="flex items-center space-x-1">
            <span>💧</span>
            <span>{weather?.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💨</span>
            <span>{weather?.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    )
  }

  if (!weather) return <div className="text-center text-blue-600">Loading...</div>

  return (
    <div className="text-center space-y-2">
      <div className="text-4xl">{getWeatherIcon(weather.weatherDesc)}</div>
      <div className="text-lg font-bold text-blue-800">{weather.temperature}°C</div>
      <div className="text-sm text-blue-600">{weather.weatherDesc}</div>
      <div className="flex justify-around text-xs text-blue-700 mt-2">
        <div className="flex items-center space-x-1">
          <span>💧</span>
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>💨</span>
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}
