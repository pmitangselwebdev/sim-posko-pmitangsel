"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Mock data for disaster statistics
const monthlyDisasterData = [
  { month: 'Jan', bencana: 12, rujukan: 45, kecelakaan: 28 },
  { month: 'Feb', bencana: 8, rujukan: 32, kecelakaan: 22 },
  { month: 'Mar', bencana: 15, rujukan: 58, kecelakaan: 35 },
  { month: 'Apr', bencana: 22, rujukan: 67, kecelakaan: 41 },
  { month: 'May', bencana: 18, rujukan: 52, kecelakaan: 38 },
  { month: 'Jun', bencana: 25, rujukan: 71, kecelakaan: 45 },
  { month: 'Jul', bencana: 20, rujukan: 63, kecelakaan: 42 },
  { month: 'Aug', bencana: 16, rujukan: 48, kecelakaan: 31 },
  { month: 'Sep', bencana: 14, rujukan: 39, kecelakaan: 26 },
  { month: 'Oct', bencana: 19, rujukan: 55, kecelakaan: 37 },
  { month: 'Nov', bencana: 23, rujukan: 69, kecelakaan: 44 },
  { month: 'Dec', bencana: 17, rujukan: 51, kecelakaan: 33 },
]

const kecamatanStats = [
  { name: 'Ciputat', bencana: 45, rujukan: 120, kecelakaan: 78, populasi: 250000 },
  { name: 'Ciputat Timur', bencana: 38, rujukan: 95, kecelakaan: 62, populasi: 180000 },
  { name: 'Pamulang', bencana: 52, rujukan: 145, kecelakaan: 89, populasi: 320000 },
  { name: 'Serpong', bencana: 41, rujukan: 110, kecelakaan: 71, populasi: 280000 },
  { name: 'Serpong Utara', bencana: 35, rujukan: 85, kecelakaan: 55, populasi: 200000 },
  { name: 'Setu', bencana: 28, rujukan: 75, kecelakaan: 48, populasi: 150000 },
  { name: 'Cisauk', bencana: 33, rujukan: 90, kecelakaan: 59, populasi: 170000 },
]

const disasterTypeData = [
  { name: 'Banjir', value: 156, color: '#3b82f6' },
  { name: 'Kebakaran', value: 89, color: '#ef4444' },
  { name: 'Longsor', value: 67, color: '#8b5cf6' },
  { name: 'Konflik', value: 34, color: '#f59e0b' },
  { name: 'Kecelakaan', value: 234, color: '#10b981' },
  { name: 'Lainnya', value: 45, color: '#6b7280' },
]

const responseTimeData = [
  { time: '0-5 min', count: 45, percentage: 15 },
  { time: '5-15 min', count: 120, percentage: 40 },
  { time: '15-30 min', count: 95, percentage: 32 },
  { time: '30+ min', count: 40, percentage: 13 },
]

const COLORS = ['#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280']

export default function Statistics() {
  const [bloodStockData, setBloodStockData] = useState([])
  const [totalBloodStock, setTotalBloodStock] = useState(0)

  useEffect(() => {
    fetchBloodStockData()
  }, [])

  const fetchBloodStockData = async () => {
    try {
      const response = await fetch('/api/blood-stock')
      if (response.ok) {
        const data = await response.json()
        setBloodStockData(data)
        const total = data.reduce((sum, stock) => sum + stock.quantity, 0)
        setTotalBloodStock(total)
      }
    } catch (error) {
      console.error('Failed to fetch blood stock data:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistik Bencana</h1>
          <p className="text-muted-foreground">
            Analisis data kejadian bencana, rujukan, dan kecelakaan di Kota Tangerang Selatan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Data Terbaru: {new Date().toLocaleDateString('id-ID')}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kejadian Bencana</CardTitle>
            <span className="text-2xl">🌪️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">641</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rujukan</CardTitle>
            <span className="text-2xl">🏥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">
              +8% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kecelakaan Lalu Lintas</CardTitle>
            <span className="text-2xl">🚨</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,123</div>
            <p className="text-xs text-muted-foreground">
              +15% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Darah Tersedia</CardTitle>
            <span className="text-2xl">🩸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBloodStock}</div>
            <p className="text-xs text-muted-foreground">
              kantong darah siap pakai
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Trend Kejadian Bulanan 2024</CardTitle>
            <CardDescription>
              Perbandingan kejadian bencana, rujukan, dan kecelakaan per bulan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyDisasterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="bencana" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="rujukan" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="kecelakaan" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disaster Types */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Jenis Bencana</CardTitle>
            <CardDescription>
              Persentase kejadian berdasarkan jenis bencana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={disasterTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {disasterTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader>
            <CardTitle>Waktu Response PMI</CardTitle>
            <CardDescription>
              Distribusi waktu tanggap darurat PMI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {responseTimeData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.time}</span>
                  <span>{item.count} kejadian ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Kecamatan Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik per Kecamatan</CardTitle>
          <CardDescription>
            Perbandingan kejadian bencana, rujukan, dan kecelakaan di setiap kecamatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kecamatanStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bencana" fill="#ef4444" name="Bencana" />
              <Bar dataKey="rujukan" fill="#3b82f6" name="Rujukan" />
              <Bar dataKey="kecelakaan" fill="#10b981" name="Kecelakaan" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tingkat Risiko</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Risiko Tinggi</span>
              <Badge variant="destructive">3 Kecamatan</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Risiko Sedang</span>
              <Badge variant="secondary">3 Kecamatan</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Risiko Rendah</span>
              <Badge variant="outline">1 Kecamatan</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kesiapsiagaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Posko Aktif</span>
                <span className="font-medium">12/12</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Relawan Terlatih</span>
                <span className="font-medium">487/500</span>
              </div>
              <Progress value={97} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ambulan Siap</span>
                <span className="font-medium">8/10</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prediksi Tren</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Musim Hujan
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                Peningkatan 25% kejadian banjir diperkirakan
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Kepadatan Lalu Lintas
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-300">
                Risiko kecelakaan meningkat 15%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
