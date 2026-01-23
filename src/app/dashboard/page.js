"use client"

import { useState } from "react"
import Map from "@/components/map"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useDashboardStats, useWeather } from "@/hooks/use-dashboard"

export default function Dashboard() {
  const [showStats, setShowStats] = useState(true)

  // React Query hooks for automatic caching and background updates
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats()
  const { data: weatherData, isLoading: weatherLoading } = useWeather()

  // Use fallback data if queries are still loading or failed
  const stats = dashboardStats || {
    activeIncidents: { disaster: 0, ambulance: 0 },
    fleet: { ambulance: 0, motor: 0, operational: 0 },
    personnel: { total: 0, male: 0, female: 0 },
    beneficiaries: { disaster: 0, ambulance: 0 },
    bloodStock: {}
  }

  const weather = weatherData || {
    temperature: '31',
    humidity: '67',
    windSpeed: '12',
    weatherDesc: 'Cerah Berawan',
    forecast: []
  }

  const isLoading = statsLoading || weatherLoading

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
    <div className="flex flex-1 flex-col gap-3 sm:gap-4 p-3 sm:p-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard PMI Tangsel</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sistem Informasi Posko PMI Kota Tangerang Selatan
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <img src="/images/logo pmi-tangsel.png" alt="PMI Logo" className="h-12 sm:h-16 md:h-20 drop-shadow-lg" />
        </div>
      </div>

      {/* MOBILE STATS - ABOVE MAP */}
      {showStats && (
        <div className="lg:hidden">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">📊 Dashboard Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* WEATHER - PROMINENT FEATURED BLOCK */}
              <div className="bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-4xl">{getWeatherIcon(weather.weatherDesc)}</div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{weather.temperature}°C</div>
                        <div className="text-sm text-muted-foreground">{weather.weatherDesc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>💧 {weather.humidity}%</span>
                      <span>💨 {weather.windSpeed} km/h</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS GRID - MODERN CARDS */}
              <div className="grid grid-cols-3 gap-3">
                {/* ACTIVE INCIDENTS */}
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-3 border border-red-500/20 text-center">
                  <div className="text-2xl mb-1">🚨</div>
                  <div className="text-lg font-bold text-red-600">{stats.activeIncidents.disaster + stats.activeIncidents.ambulance}</div>
                  <div className="text-xs text-muted-foreground font-medium">Aktif</div>
                </div>

                {/* PERSONNEL */}
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border border-orange-500/20 text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-lg font-bold text-orange-600">{stats.personnel.total}</div>
                  <div className="text-xs text-muted-foreground font-medium">Personil</div>
                </div>

                {/* FLEET */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-3 border border-blue-500/20 text-center">
                  <div className="text-2xl mb-1">🚛</div>
                  <div className="text-lg font-bold text-blue-600">{stats.fleet.ambulance + stats.fleet.motor + stats.fleet.operational}</div>
                  <div className="text-xs text-muted-foreground font-medium">Armada</div>
                </div>
              </div>

              {/* BOTTOM SECTION - BLOOD STOCK & EMERGENCY */}
              <div className="grid grid-cols-2 gap-3">
                {/* BLOOD STOCK - MODERN CARD */}
                <div className="bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-xl p-3 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-lg">❤️</div>
                    <div className="font-semibold text-sm">Stok Darah</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <div className="text-xs font-bold text-red-600">A+</div>
                      <div className="text-sm font-semibold">{stats.bloodStock['A+'] || 0}</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <div className="text-xs font-bold text-red-600">B+</div>
                      <div className="text-sm font-semibold">{stats.bloodStock['B+'] || 0}</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <div className="text-xs font-bold text-red-600">O+</div>
                      <div className="text-sm font-semibold">{stats.bloodStock['O+'] || 0}</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <div className="text-xs font-bold text-red-600">AB+</div>
                      <div className="text-sm font-semibold">{stats.bloodStock['AB+'] || 0}</div>
                    </div>
                  </div>
                </div>

                {/* EMERGENCY CONTACTS - MODERN CARD */}
                <div className="bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-xl p-3 border border-slate-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-lg">📞</div>
                    <div className="font-semibold text-sm">Darurat</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-500/10 rounded-lg p-2">
                      <span className="text-xs">🚑 Ambulans</span>
                      <span className="font-bold text-sm">119</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-500/10 rounded-lg p-2">
                      <span className="text-xs">🔥 Damkar</span>
                      <span className="font-bold text-sm">113</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-500/10 rounded-lg p-2">
                      <span className="text-xs">👮 Polisi</span>
                      <span className="font-bold text-sm">110</span>
                    </div>
                    <Button size="sm" className="w-full text-xs h-7 mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" asChild>
                      <a href="/donasi" target="_blank">💝 Donasi</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MAP SECTION */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-lg sm:text-xl">Peta Interaktif Kota Tangerang Selatan</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg w-full sm:w-auto"
          >
            {showStats ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            <span className="text-xs sm:text-sm">{showStats ? "Hide Stats" : "Show Stats"}</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-xl overflow-hidden border relative">
            {/* MAP */}
            <div className="absolute inset-0 z-0">
              <Map />
            </div>

            {/* DESKTOP/TABLET: LEFT SIDEBAR - DETAILED STATS */}
            {showStats && (
              <div className="hidden lg:block absolute top-6 left-6 bottom-6 z-20 w-80">
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
            )}

            {/* DESKTOP: RIGHT COLUMN - MAIN STATS */}
            {showStats && (
              <div className="hidden lg:block absolute top-6 right-6 bottom-6 z-20 w-96">
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
                            <div className="text-2xl font-bold text-primary">{weather.temperature}°C</div>
                            <p className="text-sm text-muted-foreground">{weather.weatherDesc}</p>
                            <div className="mt-1 text-xs text-muted-foreground space-y-1">
                              <div>Kelembapan: {weather.humidity}%</div>
                              <div>Angin: {weather.windSpeed} km/h</div>
                            </div>
                          </div>
                          <div className="text-center ml-4">
                            <div className="text-6xl">
                              {getWeatherIcon(weather.weatherDesc)}
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
                        {weather.forecast && weather.forecast.length > 0 && (
                          <div className="border-t pt-2">
                            <div className="text-xs font-medium text-muted-foreground mb-2">Prakiraan Besok</div>
                            <div className="grid grid-cols-2 gap-2">
                              {weather.forecast.slice(0, 2).map((forecast, index) => (
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
                          <div className="text-lg font-bold text-destructive">{stats.activeIncidents.disaster}</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">🚑</div>
                          <div className="text-xs font-medium">Ambulans</div>
                          <div className="text-lg font-bold text-blue-600">{stats.activeIncidents.ambulance}</div>
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
                            <div className="text-lg font-bold text-blue-600">{stats.fleet.ambulance}</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">🏍️</div>
                            <div className="text-xs font-medium">Motor</div>
                            <div className="text-lg font-bold text-green-600">{stats.fleet.motor}</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">🚐</div>
                            <div className="text-xs font-medium">Operasional</div>
                            <div className="text-lg font-bold text-purple-600">{stats.fleet.operational}</div>
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
                            <div className="text-lg font-bold text-orange-600">{stats.personnel.total}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-bold text-blue-600">👨</div>
                              <div className="text-sm font-bold text-blue-600">{stats.personnel.male}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-bold text-pink-600">👩</div>
                              <div className="text-sm font-bold text-pink-600">{stats.personnel.female}</div>
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
                          <div className="text-lg font-bold text-destructive">{stats.beneficiaries.disaster}</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">🚑</div>
                          <div className="text-xs font-medium">Ambulans</div>
                          <div className="text-lg font-bold text-blue-600">{stats.beneficiaries.ambulance}</div>
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
                          <div className="text-sm font-medium">{stats.bloodStock['A+'] || 0}</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">B+</div>
                          <div className="text-sm font-medium">{stats.bloodStock['B+'] || 0}</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">O+</div>
                          <div className="text-sm font-medium">{stats.bloodStock['O+'] || 0}</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">AB+</div>
                          <div className="text-sm font-medium">{stats.bloodStock['AB+'] || 0}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
