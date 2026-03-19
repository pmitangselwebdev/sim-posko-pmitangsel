"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import DashboardPreview from "@/components/dashboard-preview"
import {
  MapPin,
  Users,
  Activity,
  Shield,
  Heart,
  BarChart3,
  Phone,
  Ambulance,
  Droplets,
  ChefHat,
  Truck,
  Settings,
  Eye,
  EyeOff
} from "lucide-react"

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">PMI Tangsel</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Command Center</p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                Fitur
              </Link>
              <Link href="#dashboard" className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                Dashboard
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                Tentang
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <ModeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

     

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Live Dashboard Preview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Lihat tampilan dashboard lengkap dengan data real-time kejadian bencana dan aktivitas PMI
            </p>
          </div>

          <DashboardPreview />
        </div>
      </section>
 {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <img
                src="/images/logo pmi-tangsel.png"
                alt="PMI Logo"
                className="h-16 drop-shadow-lg"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sistem Informasi Posko
            <span className="block text-red-600">PMI Kota Tangerang Selatan</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Platform terintegrasi untuk manajemen bencana, koordinasi relawan, dan pelaporan real-time
            dalam penanganan darurat di Kota Tangerang Selatan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" variant="outline" className="px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Bergabung sebagai Relawan
              </Button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">641</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Kejadian Bencana</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,847</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Rujukan</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">1,123</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Kecelakaan</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">487</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Relawan Aktif</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Fitur Unggulan Sistem
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Platform komprehensif untuk manajemen bencana dan koordinasi relawan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Peta Interaktif</CardTitle>
                <CardDescription>
                  Visualisasi real-time wilayah bencana dengan data kecamatan dan kelurahan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Monitoring Real-time</CardTitle>
                <CardDescription>
                  Tracking kejadian bencana, posko aktif, dan status relawan secara live
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Statistik & Analitik</CardTitle>
                <CardDescription>
                  Dashboard analisis data bencana dengan grafik dan tren komprehensif
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Manajemen Relawan</CardTitle>
                <CardDescription>
                  Sistem registrasi, verifikasi, dan koordinasi relawan terampil
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Ambulance className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Unit Darurat</CardTitle>
                <CardDescription>
                  Tracking ambulans, posko kesehatan, dan fasilitas medis darurat
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Truck className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle>Logistik & Distribusi</CardTitle>
                <CardDescription>
                  Manajemen stok darah, bantuan, dan distribusi logistik bencana
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bergabunglah dengan Tim Relawan PMI
          </h2>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            Jadilah bagian dari garda terdepan dalam penanganan bencana dan pertolongan masyarakat
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                <Heart className="mr-2 h-5 w-5" />
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-red-600">
                <Shield className="mr-2 h-5 w-5" />
                Masuk ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold">PMI Tangsel</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistem Informasi Posko PMI Kota Tangerang Selatan untuk penanganan bencana dan pertolongan masyarakat.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Peta Interaktif</li>
                <li>Command Center</li>
                <li>Manajemen Relawan</li>
                <li>Statistik Real-time</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kontak Darurat</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🚑 Ambulans: 119</li>
                <li>� Pemadam: 113</li>
                <li>👮 Polisi: 110</li>
                <li>🏥 PMI: (021) 123-4567</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Lokasi</h3>
              <p className="text-sm text-gray-400">
                Jl. Cendekia Sektor 11, Ciater, Serpong<br />
                Kota Tangerang Selatan<br />
                Banten 15310
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 PMI Kota Tangerang Selatan. All rights reserved.</p>
            <p className="mt-2">Developed by PMI Tangsel WebDev Team</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
