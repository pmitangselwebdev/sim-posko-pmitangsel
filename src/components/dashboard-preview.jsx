"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import Map from "@/components/map"

export default function DashboardPreview() {
  const [showStats, setShowStats] = useState(true)
  const [weatherData, setWeatherData] = useState({
    temperature: '31',
    humidity: '67',
    windSpeed: '12',
    weatherDesc: 'Cerah Berawan',
    forecast: []
  })

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather')
        if (response.ok) {
          const data = await response.json()
          setWeatherData(data)
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error)
      }
    }

    fetchWeather()
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase()
    if (desc.includes('cerah')) return '☀️'
    if (desc.includes('berawan')) return '⛅'
    if (desc.includes('hujan')) return '🌧️'
    if (desc.includes('petir')) return '⛈️'
    if (desc.includes('kabut')) return '🌫️'
    return '🌤️'
  }

  return (
    <div className="w-full relative">
      {/* STATS TOGGLE BUTTON */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg"
        >
          {showStats ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showStats ? "Hide Stats" : "Show Stats"}
        </Button>
      </div>

      <Card className="overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardTitle className="flex items-center gap-2">
            🗺️ Peta Interaktif Kota Tangerang Selatan
          </CardTitle>
          <CardDescription className="text-red-100">
            Monitoring real-time kejadian bencana dan aktivitas PMI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* MAP */}
            <div className="h-[700px]">
              <Map />
            </div>

            {/* STATS OVERLAY - SAME SIZE AS MAP */}
            {showStats && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* LEFT COLUMN - EMERGENCY CONTACTS & SUPPORT */}
                <div className="absolute top-6 left-6 bottom-6 w-80 pointer-events-auto">
                  <div className="grid grid-cols-1 gap-1 h-full">
                    {/* EMERGENCY CONTACTS - LIST FORMAT */}
                    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          📞 Kontak Darurat
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="space-y-1 text-xs">
                          {[
                            { icon: "🚑", label: "Ambulans", number: "119" },
                            { icon: "🔥", label: "Pemadam Kebakaran", number: "113" },
                            { icon: "🌪️", label: "BPBD", number: "021-123456" },
                            { icon: "👮‍♂️", label: "Polisi", number: "110" },
                            { icon: "❤️", label: "PMI Tangsel", number: "021-7654321" },
                            { icon: "🏥", label: "RS PMI", number: "021-112233" },
                          ].map((contact) => (
                            <div
                              key={contact.label}
                              className="flex items-center justify-between p-1.5 rounded-md border bg-card/80 hover:bg-accent/80 transition-colors cursor-pointer"
                              title={`${contact.label}: ${contact.number}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{contact.icon}</span>
                                <span className="font-medium text-xs">{contact.label}</span>
                              </div>
                              <span className="font-semibold text-xs">{contact.number}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* DONATIONS & PARTNERSHIPS - COMBINED */}
                    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          💝 Dukungan PMI
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="space-y-3">
                          {/* DONATIONS SECTION */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Donasi</div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-1 text-xs">
                                <span>📞</span>
                                <span className="font-medium">021-1234567</span>
                              </div>
                              <Button size="sm" className="w-full text-xs h-7" asChild>
                                <a href="/donasi" target="_blank">Donasi Sekarang</a>
                              </Button>
                            </div>
                          </div>

                          {/* PARTNERSHIPS SECTION */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Kemitraan</div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-1 text-xs">
                                <span>📞</span>
                                <span className="font-medium">021-7654321</span>
                              </div>
                              <Button size="sm" variant="outline" className="w-full text-xs h-7" asChild>
                                <a href="/kemitraan" target="_blank">Info Kemitraan</a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* RIGHT COLUMN - MAIN STATS */}
                <div className="absolute top-6 right-6 bottom-6 w-96 pointer-events-auto">
                  <div className="grid grid-cols-1 gap-1 h-full">
                    {/* WEATHER - SPAN 2 COLUMNS */}
                    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                    <CardHeader className="pb-1 pt-1">
                      <CardTitle className="text-sm font-medium text-center">
                        🌤️ Prakiraan Cuaca
                      </CardTitle>
                    </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="space-y-3">
                          {/* CURRENT WEATHER */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <div className="text-2xl font-bold text-primary">{weatherData.temperature}°C</div>
                              <p className="text-sm text-muted-foreground">{weatherData.weatherDesc}</p>
                              <div className="mt-1 text-xs text-muted-foreground space-y-1">
                                <div>Kelembapan: {weatherData.humidity}%</div>
                                <div>Angin: {weatherData.windSpeed} km/h</div>
                              </div>
                            </div>
                            <div className="text-center ml-4">
                              <div className="text-6xl">
                                {getWeatherIcon(weatherData.weatherDesc)}
                              </div>
                              <div className="text-xs text-muted-foreground dark:text-gray-300 mt-1">
                              {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                            </div>
                          </div>

                          {/* FORECAST FOR TOMORROW */}
                          {weatherData.forecast && weatherData.forecast.length > 0 && (
                            <div className="border-t pt-2">
                              <div className="text-xs font-medium text-muted-foreground mb-2">Prakiraan Besok</div>
                              <div className="grid grid-cols-2 gap-2">
                                {weatherData.forecast.slice(0, 2).map((forecast, index) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm">{getWeatherIcon(forecast.weatherDesc)}</span>
                                      <span className="text-muted-foreground">
                                        {forecast.time.includes(':') ? forecast.time.split(':')[0] + ':00' : forecast.time}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">{forecast.temperature}°C</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* ACTIVE INCIDENTS - SPAN 2 COLUMNS */}
                    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                    <CardHeader className="pb-1 pt-1">
                      <CardTitle className="text-sm font-medium text-center">
                        🚨 Kejadian Aktif
                      </CardTitle>
                    </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold text-destructive">🌪️</div>
                            <div className="text-xs font-medium">Bencana</div>
                            <div className="text-lg font-bold text-destructive">1</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">🚑</div>
                            <div className="text-xs font-medium">Ambulans</div>
                            <div className="text-lg font-bold text-blue-600">1</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* FLEET & PERSONNEL - ASYMMETRIC LAYOUT */}
                    <div className="grid grid-cols-3 gap-1">
                      {/* FLEET CARD - 1.5 COLUMNS WIDE */}
                      <Card className="col-span-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg" style={{gridColumn: 'span 1.8 / span 1.8'}}>
                        <CardHeader className="pt-1 pb-1">
                          <CardTitle className="text-sm font-medium text-center">
                            🚛 Armada
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-2">
                          <div className="grid grid-cols-3 gap-1 text-center">
                            <div>
                              <div className="text-lg font-bold text-blue-600">🚑</div>
                              <div className="text-xs font-medium">Ambulans</div>
                              <div className="text-lg font-bold text-blue-600">5</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">🏍️</div>
                              <div className="text-xs font-medium">Motor</div>
                              <div className="text-lg font-bold text-green-600">3</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-purple-600">🚐</div>
                              <div className="text-xs font-medium">Operasional</div>
                              <div className="text-lg font-bold text-purple-600">7</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* PERSONNEL CARD - 1 COLUMN WIDE */}
                      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                        <CardHeader className="pb-1 pt-1">
                          <CardTitle className="text-sm font-medium text-center">
                            👥 Personil
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-2">
                          <div className="space-y-2 text-center">
                            <div>
                              <div className="text-lg font-bold text-orange-600">🧑‍⚕️</div>
                              <div className="text-xs font-medium">Total Relawan</div>
                              <div className="text-lg font-bold text-orange-600">53</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="flex flex-col items-center">
                                <div className="text-sm font-bold text-blue-600">👨</div>
                                <div className="text-xs font-medium text-foreground dark:text-gray-200">Laki-laki</div>
                                <div className="text-sm font-bold text-blue-600">32</div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="text-sm font-bold text-pink-600">👩</div>
                                <div className="text-xs font-medium text-foreground dark:text-gray-200">Perempuan</div>
                                <div className="text-sm font-bold text-pink-600">21</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* BENEFICIARIES - SPAN 2 COLUMNS */}
                    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                    <CardHeader className="pb-1 pt-1">
                      <CardTitle className="text-sm font-medium text-center">
                        🤝 Penerima Manfaat
                      </CardTitle>
                    </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold text-destructive">🌪️</div>
                            <div className="text-xs font-medium">Kebencanaan</div>
                            <div className="text-lg font-bold text-destructive">120</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">🚑</div>
                            <div className="text-xs font-medium">Ambulans</div>
                            <div className="text-lg font-bold text-blue-600">80</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* BLOOD STOCK - SPAN 2 COLUMNS */}
                    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
                    <CardHeader className="pb-1 pt-1">
                      <CardTitle className="text-sm font-medium text-center">
                        ❤️ Stok Darah
                      </CardTitle>
                    </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="grid grid-cols-4 gap-1 text-center">
                          <div>
                            <div className="text-lg font-bold text-red-600">A+</div>
                            <div className="text-sm font-medium">10</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">B+</div>
                            <div className="text-sm font-medium">5</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">O+</div>
                            <div className="text-sm font-medium">8</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">AB+</div>
                            <div className="text-sm font-medium">8</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
