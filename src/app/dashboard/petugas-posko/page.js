"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useMounted } from "@/hooks/use-mounted"
import LaporanSituasiForm from "@/components/LaporanSituasiForm"
import { generateReportPDF, downloadPDF } from "@/lib/pdfGenerator"
import LaporanSituasiTemplate from "@/components/LaporanSituasiTemplate"
import VehicleForm from "@/components/VehicleForm"

export default function PetugasPosko() {
  const { toast } = useToast()
  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [incidents, setIncidents] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [reports, setReports] = useState([])
  const [showNewReport, setShowNewReport] = useState(false)
  const [showSituasiForm, setShowSituasiForm] = useState(false)
  const [showIncidentForm, setShowIncidentForm] = useState(false)
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showEditIncidentForm, setShowEditIncidentForm] = useState(false)
  const [showEditVehicleForm, setShowEditVehicleForm] = useState(false)
  const [showEditVehicleDialog, setShowEditVehicleDialog] = useState(false)
  const [showViewIncidentDialog, setShowViewIncidentDialog] = useState(false)
  const [showViewVehicleDialog, setShowViewVehicleDialog] = useState(false)
  const [editingIncident, setEditingIncident] = useState(null)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [viewingIncident, setViewingIncident] = useState(null)
  const [viewingVehicle, setViewingVehicle] = useState(null)

  const [newReport, setNewReport] = useState({
    type: "",
    shift: "",
    aktivitas: "",
    jumlahPanggilan: "",
    jumlahRujukan: "",
    catatan: "",
    bloodStockUpdates: []
  })

  const [bloodStocks, setBloodStocks] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [incidentsRes, vehiclesRes, reportsRes, bloodStockRes] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/vehicles'),
        fetch('/api/reports'),
        fetch('/api/blood-stock')
      ])

      if (incidentsRes.ok) setIncidents(await incidentsRes.json())
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json())
      if (reportsRes.ok) setReports(await reportsRes.json())
      if (bloodStockRes.ok) setBloodStocks(await bloodStockRes.json())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const handleSubmitReport = async () => {
    try {
      // First, update blood stock if there are updates
      if (newReport.bloodStockUpdates && newReport.bloodStockUpdates.length > 0) {
        for (const update of newReport.bloodStockUpdates) {
          if (update.quantity > 0) {
            await fetch('/api/blood-stock', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: update.bloodStockId,
                quantity: update.quantity
              })
            })
          }
        }
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Laporan berhasil disimpan.",
          duration: 3000,
        })
        setShowNewReport(false)
        setNewReport({
          type: "",
          shift: "",
          aktivitas: "",
          jumlahPanggilan: "",
          jumlahRujukan: "",
          catatan: "",
          bloodStockUpdates: []
        })
        fetchDashboardData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Gagal menyimpan laporan.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan jaringan.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleSituasiFormSubmit = async (formData) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'laporan-situasi',
          data: formData
        })
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Laporan Situasi berhasil disimpan.",
          duration: 3000,
        })
        setShowSituasiForm(false)
        fetchDashboardData()
      } else {
        toast({
          title: "Error",
          description: "Gagal menyimpan laporan situasi.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan jaringan.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleExportPDF = async (report) => {
    // Show confirmation dialog first
    const confirmed = window.confirm('Apakah Anda ingin mengekspor laporan ini ke PDF?')
    if (!confirmed) return

    try {
      const pdf = await generateReportPDF(
        report.type === 'laporan-situasi' ? report.data : report.data,
        report.type
      )
      const filename = `laporan-${report.type}-${new Date(report.createdAt).toISOString().split('T')[0]}.pdf`
      downloadPDF(pdf, filename)

      // Show modern success toast
      toast({
        title: "Berhasil!",
        description: "PDF laporan berhasil dibuat dan diunduh.",
        duration: 3000,
      })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast({
        title: "Error",
        description: "Gagal membuat PDF laporan.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleDeleteReport = async (reportId) => {
    try {
      const response = await fetch(`/api/reports?id=${reportId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Laporan berhasil dihapus.",
          duration: 3000,
        })
        fetchDashboardData()
      } else {
        toast({
          title: "Error",
          description: "Gagal menghapus laporan.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan jaringan.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleEditReport = async (report) => {
    // For now, just show an alert that edit functionality is coming
    toast({
      title: "Fitur Edit",
      description: "Fitur edit laporan akan segera hadir.",
      duration: 3000,
    })
  }

  const handleEditIncident = async (incident) => {
    setEditingIncident(incident)
    setShowEditIncidentForm(true)
  }

  const handleEditVehicle = async (vehicle) => {
    setEditingVehicle(vehicle)
    setShowEditVehicleDialog(true)
  }

  const handleViewIncident = async (incident) => {
    setViewingIncident(incident)
    setShowViewIncidentDialog(true)
  }

  const handleViewVehicle = async (vehicle) => {
    setViewingVehicle(vehicle)
    setShowViewVehicleDialog(true)
  }

  const handleDeleteIncident = async (incidentId) => {
    try {
      const response = await fetch(`/api/incidents?id=${incidentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Insiden berhasil dihapus.",
          duration: 3000,
        })
        fetchDashboardData()
      } else {
        toast({
          title: "Error",
          description: "Gagal menghapus insiden.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Delete incident error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan jaringan.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const response = await fetch(`/api/vehicles?id=${vehicleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Kendaraan berhasil dihapus.",
          duration: 3000,
        })
        fetchDashboardData()
      } else {
        toast({
          title: "Error",
          description: "Gagal menghapus kendaraan.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Delete vehicle error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan jaringan.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const activeIncidents = incidents.filter(incident => incident.status === 'active')
  const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'available')

  // Only render components after hydration to prevent classList errors
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Petugas Posko</h1>
          <Button disabled>
            Buat Laporan Shift
          </Button>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Petugas Posko</h1>
        <Button onClick={() => setShowNewReport(true)}>
          Buat Laporan Shift
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="incidents">Insiden Aktif</TabsTrigger>
          <TabsTrigger value="vehicles">Kendaraan</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
          <TabsTrigger value="initiate">Inisiasi Kejadian</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Insiden Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{activeIncidents.length}</div>
                <p className="text-xs text-muted-foreground">Perlu penanganan segera</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Kendaraan Tersedia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{availableVehicles.length}</div>
                <p className="text-xs text-muted-foreground">Siap digunakan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Laporan Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                <p className="text-xs text-muted-foreground">Sudah dibuat</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Insiden Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeIncidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{incident.type}</p>
                        <p className="text-xs text-muted-foreground">{incident.location}</p>
                      </div>
                      <Badge variant="destructive">Aktif</Badge>
                    </div>
                  ))}
                  {activeIncidents.length === 0 && (
                    <p className="text-sm text-muted-foreground">Tidak ada insiden aktif</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Kendaraan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vehicles.slice(0, 5).map((vehicle) => (
                    <div key={vehicle.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{vehicle.nomorPolisi}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                      </div>
                      <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                        {vehicle.status === 'available' ? 'Tersedia' : 'Digunakan'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Insiden Aktif</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Insiden Aktif</CardTitle>
              <p className="text-sm text-muted-foreground">
                Insiden yang sedang aktif dan memerlukan penanganan
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>{new Date(incident.date).toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          Aktif
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewIncident(incident)}
                          >
                            Lihat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditIncident(incident)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Hapus
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Insiden</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus insiden ini? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteIncident(incident.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeIncidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                        Tidak ada insiden aktif saat ini. Insiden akan muncul setelah diinisiasi dari tab &quot;Inisiasi Kejadian&quot;.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manajemen Kendaraan</h2>
            <Button onClick={() => setShowVehicleForm(true)}>
              Tambah Kendaraan
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Kendaraan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Nomor Polisi</TableHead>
                    <TableHead>Posko</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{vehicle.nomorPolisi}</TableCell>
                      <TableCell>{vehicle.posko}</TableCell>
                      <TableCell>
                        <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                          {vehicle.status === 'available' ? 'Tersedia' : 'Digunakan'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewVehicle(vehicle)}
                          >
                            Lihat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Hapus
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Kendaraan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus kendaraan ini? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Panggilan</TableHead>
                    <TableHead>Rujukan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>{report.data?.shift || '-'}</TableCell>
                      <TableCell>{report.type === 'laporan-harian' ? 'Laporan Harian' : 'Laporan Situasi'}</TableCell>
                      <TableCell>{report.data?.jumlahPanggilan || '-'}</TableCell>
                      <TableCell>{report.data?.jumlahRujukan || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportPDF(report)}
                          >
                            PDF
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Hapus
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Laporan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteReport(report.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="initiate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inisiasi Kejadian Bencana</CardTitle>
              <p className="text-sm text-muted-foreground">
                Buat kejadian bencana baru untuk memungkinkan petugas membuat laporan situasi
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Jenis Kejadian</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kejadian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gempa-bumi">Gempa Bumi</SelectItem>
                        <SelectItem value="tsunami">Tsunami</SelectItem>
                        <SelectItem value="banjir">Banjir</SelectItem>
                        <SelectItem value="tanah-longsor">Tanah Longsor</SelectItem>
                        <SelectItem value="angin-puting-beliung">Angin Puting Beliung</SelectItem>
                        <SelectItem value="kebakaran-hutan">Kebakaran Hutan</SelectItem>
                        <SelectItem value="kebakaran-kota">Kebakaran Kota</SelectItem>
                        <SelectItem value="gunung-meletus">Gunung Meletus</SelectItem>
                        <SelectItem value="kekeringan">Kekeringan</SelectItem>
                        <SelectItem value="epidemi">Epidemi/Penyakit</SelectItem>
                        <SelectItem value="konflik-sosial">Konflik Sosial</SelectItem>
                        <SelectItem value="kecelakaan-transportasi">Kecelakaan Transportasi</SelectItem>
                        <SelectItem value="bencana-lainnya">Bencana Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tanggal Kejadian</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Waktu Kejadian</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label>Zona Waktu</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih zona waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WIB">WIB</SelectItem>
                        <SelectItem value="WITA">WITA</SelectItem>
                        <SelectItem value="WIT">WIT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Lokasi Terdampak</Label>
                  <Textarea
                    placeholder="Sebutkan provinsi, kabupaten/kota, kecamatan, desa/kelurahan"
                    rows="2"
                  />
                </div>

                <div>
                  <Label>Deskripsi Kejadian</Label>
                  <Textarea
                    placeholder="Ringkasan kejadian, intensitas, durasi, dll"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowIncidentForm(true)}>
                    Inisiasi Kejadian
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kejadian Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>{new Date(incident.date).toLocaleString("id-ID")}</TableCell>
                      <TableCell><Badge variant="destructive">Aktif</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Buat Laporan Situasi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeIncidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                        Belum ada kejadian aktif. Silakan inisiasi kejadian bencana terlebih dahulu.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Report Dialog */}
      <Dialog open={showNewReport} onOpenChange={setShowNewReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Laporan Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Jenis Laporan</Label>
                <Select value={newReport.type} onValueChange={(value) => {
                  setNewReport({...newReport, type: value})
                  if (value === 'laporan-situasi') {
                    setShowNewReport(false)
                    setShowSituasiForm(true)
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laporan-harian">Laporan Harian</SelectItem>
                    <SelectItem value="laporan-situasi">Laporan Situasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Shift</Label>
                <Select value={newReport.shift} onValueChange={(value) => setNewReport({...newReport, shift: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shift 1">Shift 1 (08:00-20:00)</SelectItem>
                    <SelectItem value="Shift 2">Shift 2 (20:00-08:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aktivitas Utama</Label>
              <Textarea
                placeholder="Jelaskan aktivitas utama selama shift"
                value={newReport.aktivitas}
                onChange={(e) => setNewReport({...newReport, aktivitas: e.target.value})}
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Jumlah Panggilan</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newReport.jumlahPanggilan}
                  onChange={(e) => setNewReport({...newReport, jumlahPanggilan: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Rujukan</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newReport.jumlahRujukan}
                  onChange={(e) => setNewReport({...newReport, jumlahRujukan: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Update Stok Darah</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bloodStocks.map((stock) => (
                  <div key={stock.id} className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">{stock.type}</Label>
                      <Badge variant="outline" className="text-xs">
                        {stock.quantity} kantong
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Update stok"
                        className="flex-1"
                        min="0"
                        onChange={(e) => {
                          const updates = [...newReport.bloodStockUpdates]
                          const existingIndex = updates.findIndex(u => u.bloodStockId === stock.id)
                          if (existingIndex >= 0) {
                            updates[existingIndex].quantity = parseInt(e.target.value) || 0
                          } else {
                            updates.push({
                              bloodStockId: stock.id,
                              type: stock.type,
                              quantity: parseInt(e.target.value) || 0
                            })
                          }
                          setNewReport({...newReport, bloodStockUpdates: updates})
                        }}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">kantong</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Catatan Khusus</Label>
              <Textarea
                placeholder="Catatan tambahan jika ada"
                value={newReport.catatan}
                onChange={(e) => setNewReport({...newReport, catatan: e.target.value})}
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNewReport(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmitReport} size="lg">
                Simpan Laporan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Laporan Situasi Form Dialog */}
      <Dialog open={showSituasiForm} onOpenChange={setShowSituasiForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <LaporanSituasiForm
            onSubmit={handleSituasiFormSubmit}
            onCancel={() => setShowSituasiForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Incident Dialog */}
      <Dialog open={showViewIncidentDialog} onOpenChange={setShowViewIncidentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Insiden</DialogTitle>
          </DialogHeader>
          {viewingIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Jenis Kejadian</Label>
                  <p className="text-sm">{viewingIncident.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={viewingIncident.status === 'active' ? 'destructive' : 'secondary'}>
                    {viewingIncident.status === 'active' ? 'Aktif' : 'Selesai'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lokasi</Label>
                  <p className="text-sm">{viewingIncident.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Waktu Kejadian</Label>
                  <p className="text-sm">{new Date(viewingIncident.date).toLocaleString("id-ID")}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Deskripsi</Label>
                <p className="text-sm mt-1">{viewingIncident.description || 'Tidak ada deskripsi'}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowViewIncidentDialog(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Vehicle Dialog */}
      <Dialog open={showViewVehicleDialog} onOpenChange={setShowViewVehicleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Kendaraan</DialogTitle>
          </DialogHeader>
          {viewingVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Jenis Kendaraan</Label>
                  <p className="text-sm">{viewingVehicle.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={viewingVehicle.status === 'available' ? 'default' : 'secondary'}>
                    {viewingVehicle.status === 'available' ? 'Tersedia' : 'Digunakan'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nomor Polisi</Label>
                  <p className="text-sm">{viewingVehicle.nomorPolisi}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nomor Lambung</Label>
                  <p className="text-sm">{viewingVehicle.nomorLambung || 'Tidak ada'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Posko</Label>
                  <p className="text-sm">{viewingVehicle.posko}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowViewVehicleDialog(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditVehicleDialog} onOpenChange={setShowEditVehicleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Status Kendaraan</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Kendaraan</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <p className="font-medium">{editingVehicle.type}</p>
                  <p className="text-sm text-muted-foreground">{editingVehicle.nomorPolisi}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status Kendaraan</Label>
                <Select
                  value={editingVehicle.status}
                  onValueChange={(value) => setEditingVehicle({...editingVehicle, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Tersedia</SelectItem>
                    <SelectItem value="in-use">Sedang Bertugas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditVehicleDialog(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/vehicles', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id: editingVehicle.id,
                          status: editingVehicle.status
                        })
                      })

                      if (response.ok) {
                        toast({
                          title: "Berhasil!",
                          description: "Status kendaraan berhasil diperbarui.",
                          duration: 3000,
                        })
                        setShowEditVehicleDialog(false)
                        setEditingVehicle(null)
                        fetchDashboardData()
                      } else {
                        toast({
                          title: "Error",
                          description: "Gagal memperbarui status kendaraan.",
                          variant: "destructive",
                          duration: 3000,
                        })
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Terjadi kesalahan jaringan.",
                        variant: "destructive",
                        duration: 3000,
                      })
                    }
                  }}
                >
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vehicle Form Dialog */}
      <Dialog open={showVehicleForm} onOpenChange={setShowVehicleForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Checklist Kelayakan Ambulans PMI Kota Tangerang Selatan</DialogTitle>
          </DialogHeader>
          <VehicleForm onSubmit={() => {
            setShowVehicleForm(false)
            fetchDashboardData()
          }} />
        </DialogContent>
      </Dialog>

      {/* Hidden PDF Template for Disaster Situation Reports */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <LaporanSituasiTemplate data={{}} />
      </div>
    </div>
  )
}
