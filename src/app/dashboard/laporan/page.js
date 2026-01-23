"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { generateReportPDF, downloadPDF } from "@/lib/pdfGenerator"
import { useMounted } from "@/hooks/use-mounted"

export default function InsidenKejadianDarurat() {
  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState("list")
  const [incidents, setIncidents] = useState([])
  const [assessments, setAssessments] = useState([])
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false)
  const [newIncident, setNewIncident] = useState({
    type: "",
    location: "",
    date: "",
    description: "",
    victims: ""
  })
  const [newCommunication, setNewCommunication] = useState("")

  useEffect(() => {
    fetchIncidents()
    fetchAssessments()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch("/api/incidents")
      if (response.ok) {
        const data = await response.json()
        setIncidents(data)
      }
    } catch (error) {
      console.error("Error fetching incidents:", error)
    }
  }

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessment")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
    }
  }

  const handleCreateIncident = async () => {
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident),
      })
      if (response.ok) {
        alert("Insiden berhasil dibuat!")
        setShowNewIncidentForm(false)
        setNewIncident({ type: "", location: "", date: "", description: "", victims: "" })
        fetchIncidents()
      } else {
        alert("Gagal membuat insiden")
      }
    } catch (error) {
      alert("Network error")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Aktif</Badge>
      case "closed":
        return <Badge variant="secondary">Ditutup</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleExportReport = async (incident) => {
    // Find assessment data for this incident
    const incidentAssessments = assessments.filter(assessment => assessment.incidentId === incident.id)

    if (incidentAssessments.length === 0) {
      alert("Tidak ada data assessment untuk insiden ini")
      return
    }

    // Use the most recent assessment
    const latestAssessment = incidentAssessments[0]

    try {
      const pdf = await generateReportPDF(latestAssessment.data, 'assessment-report')
      downloadPDF(pdf, `laporan-insiden-${incident.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Gagal membuat PDF")
    }
  }

  const handleAddCommunication = async () => {
    if (!selectedIncident || !newCommunication.trim()) return

    try {
      const response = await fetch(`/api/incidents/${selectedIncident.id}/communications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newCommunication }),
      })
      if (response.ok) {
        setNewCommunication("")
        fetchIncidents() // Refresh to get updated communications
      } else {
        alert("Gagal menambahkan komunikasi")
      }
    } catch (error) {
      alert("Network error")
    }
  }

  // Assessment Card Component
  const AssessmentCard = ({ assessment, index }) => (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-sm">
            Assessment #{index + 1} - {assessment.type === 'bencana' ? 'Bencana' : 'Ambulance'}
          </h4>
          <p className="text-xs text-muted-foreground">
            Oleh: {assessment.user?.namaLengkap || 'Petugas'} |
            {new Date(assessment.createdAt).toLocaleString("id-ID")}
          </p>
          {assessment.incidentId && (
            <p className="text-xs text-blue-600 mt-1">
              🔗 Terhubung dengan insiden
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            try {
              const pdf = generateReportPDF(assessment.data, 'assessment-report')
              downloadPDF(pdf, `assessment-${assessment.id}.pdf`)
            } catch (error) {
              alert("Gagal membuat PDF")
            }
          }}
        >
          Export PDF
        </Button>
      </div>

      {assessment.type === "bencana" && assessment.data && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Jenis Bencana:</span> {assessment.data.jenisBencana || '-'}
            </div>
            <div>
              <span className="font-medium">Lokasi:</span> {assessment.data.lokasi || '-'}
            </div>
            <div>
              <span className="font-medium">Petugas:</span> {assessment.data.namaPetugas || '-'}
            </div>
            <div>
              <span className="font-medium">Waktu:</span> {assessment.data.waktuKejadian ? new Date(assessment.data.waktuKejadian).toLocaleString("id-ID") : '-'}
            </div>
            {assessment.data.latitude && assessment.data.longitude && (
              <div className="col-span-2">
                <span className="font-medium">Koordinat:</span> {assessment.data.latitude}, {assessment.data.longitude}
              </div>
            )}
          </div>

          {/* Casualty Metrics */}
          <div>
            <h5 className="font-medium text-sm mb-2">📊 Data Korban</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                <div className="font-bold text-red-600 text-lg">{assessment.data.jumlahKorbanMeninggal || 0}</div>
                <div className="text-xs text-muted-foreground">Meninggal</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                <div className="font-bold text-orange-600 text-lg">{assessment.data.jumlahKorbanLukaBerat || 0}</div>
                <div className="text-xs text-muted-foreground">Luka Berat</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                <div className="font-bold text-yellow-600 text-lg">{assessment.data.jumlahKorbanLukaRingan || 0}</div>
                <div className="text-xs text-muted-foreground">Luka Ringan</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                <div className="font-bold text-blue-600 text-lg">{assessment.data.jumlahKorbanHilang || 0}</div>
                <div className="text-xs text-muted-foreground">Hilang</div>
              </div>
            </div>
          </div>

          {/* Damage Assessment */}
          {(assessment.data.rumahRusakBerat || assessment.data.rumahRusakRingan) && (
            <div>
              <h5 className="font-medium text-sm mb-2">🏠 Kerusakan Infrastruktur</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-200 dark:border-purple-800">
                  <div className="font-bold text-purple-600 text-lg">{assessment.data.rumahRusakBerat || 0}</div>
                  <div className="text-xs text-muted-foreground">Rumah Rusak Berat</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                  <div className="font-bold text-green-600 text-lg">{assessment.data.rumahRusakRingan || 0}</div>
                  <div className="text-xs text-muted-foreground">Rumah Rusak Ringan</div>
                </div>
              </div>
            </div>
          )}

          {/* Evacuation Info */}
          {assessment.data.pengungsi === "ada" && (
            <div>
              <h5 className="font-medium text-sm mb-2">🏕️ Data Pengungsi</h5>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded border border-indigo-200 dark:border-indigo-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Lokasi Pengungsian:</span> {assessment.data.lokasiPengungsian || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Jumlah:</span> {assessment.data.jumlahPengungsi || 0} orang
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Infrastructure Status */}
          <div>
            <h5 className="font-medium text-sm mb-2">🏗️ Status Infrastruktur</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded ${assessment.data.jalan === 'Berfungsi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Jalan: {assessment.data.jalan || 'Tidak diketahui'}
              </div>
              <div className={`p-2 rounded ${assessment.data.jembatan === 'Berfungsi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Jembatan: {assessment.data.jembatan || 'Tidak diketahui'}
              </div>
              <div className={`p-2 rounded ${assessment.data.kendaraanUmum === 'Berfungsi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Kendaraan Umum: {assessment.data.kendaraanUmum || 'Tidak diketahui'}
              </div>
              <div className={`p-2 rounded ${assessment.data.listrik === 'Berfungsi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Listrik: {assessment.data.listrik || 'Tidak diketahui'}
              </div>
              <div className={`p-2 rounded ${assessment.data.air === 'Berfungsi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Air: {assessment.data.air || 'Tidak diketahui'}
              </div>
              <div className={`p-2 rounded ${assessment.data.internet === 'Berfungsi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Internet: {assessment.data.internet || 'Tidak diketahui'}
              </div>
            </div>
          </div>

          {/* Situation Description */}
          {assessment.data.situasiKeamanan && (
            <div>
              <h5 className="font-medium text-sm mb-2">🛡️ Situasi Keamanan</h5>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                {assessment.data.situasiKeamanan}
              </div>
            </div>
          )}

          {/* Actions Taken */}
          {(assessment.data.tindakanPMI || assessment.data.tindakanInstansiLain) && (
            <div>
              <h5 className="font-medium text-sm mb-2">🚀 Tindakan yang Telah Dilakukan</h5>
              <div className="space-y-2">
                {assessment.data.tindakanPMI && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                    <div className="font-medium text-xs text-blue-600 mb-1">PMI:</div>
                    <div className="text-sm">{assessment.data.tindakanPMI}</div>
                  </div>
                )}
                {assessment.data.tindakanInstansiLain && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <div className="font-medium text-xs text-green-600 mb-1">Instansi Lain:</div>
                    <div className="text-sm">{assessment.data.tindakanInstansiLain}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Needs */}
          {(assessment.data.kebutuhanPMI || assessment.data.kebutuhanKorban) && (
            <div>
              <h5 className="font-medium text-sm mb-2">📋 Kebutuhan Mendesak</h5>
              <div className="space-y-2">
                {assessment.data.kebutuhanPMI && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <div className="font-medium text-xs text-red-600 mb-1">PMI:</div>
                    <div className="text-sm">{assessment.data.kebutuhanPMI}</div>
                  </div>
                )}
                {assessment.data.kebutuhanKorban && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                    <div className="font-medium text-xs text-orange-600 mb-1">Korban:</div>
                    <div className="text-sm">{assessment.data.kebutuhanKorban}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {assessment.type === "ambulance" && assessment.data && (
        <div className="space-y-4">
          {/* Basic Ambulance Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Lokasi:</span> {assessment.data.lokasi || '-'}
            </div>
            <div>
              <span className="font-medium">Petugas:</span> {assessment.data.namaPetugas || '-'}
            </div>
            <div>
              <span className="font-medium">Waktu:</span> {assessment.data.waktuKejadian ? new Date(assessment.data.waktuKejadian).toLocaleString("id-ID") : '-'}
            </div>
            <div>
              <span className="font-medium">Jenis Kejadian:</span> {assessment.data.jenisKejadian || '-'}
            </div>
          </div>

          {/* Ambulance Casualty Metrics */}
          <div>
            <h5 className="font-medium text-sm mb-2">🚑 Data Korban Ambulance</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                <div className="font-bold text-red-600 text-lg">{assessment.data.jumlahKorban || 0}</div>
                <div className="text-xs text-muted-foreground">Total Korban</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                <div className="font-bold text-orange-600 text-lg">{assessment.data.jumlahKorbanLukaBerat || 0}</div>
                <div className="text-xs text-muted-foreground">Luka Berat</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                <div className="font-bold text-yellow-600 text-lg">{assessment.data.jumlahKorbanLukaRingan || 0}</div>
                <div className="text-xs text-muted-foreground">Luka Ringan</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                <div className="font-bold text-blue-600 text-lg">{assessment.data.jumlahKorbanMeninggal || 0}</div>
                <div className="text-xs text-muted-foreground">Meninggal</div>
              </div>
            </div>
          </div>

          {/* Ambulance Actions & Needs */}
          {(assessment.data.tindakanYangDilakukan || assessment.data.kebutuhanTambahan) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.data.tindakanYangDilakukan && (
                <div>
                  <h5 className="font-medium text-sm mb-2">✅ Tindakan Dilakukan</h5>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800 text-sm">
                    {assessment.data.tindakanYangDilakukan}
                  </div>
                </div>
              )}
              {assessment.data.kebutuhanTambahan && (
                <div>
                  <h5 className="font-medium text-sm mb-2">📋 Kebutuhan Tambahan</h5>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800 text-sm">
                    {assessment.data.kebutuhanTambahan}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Only render components after hydration to prevent classList errors
  if (!mounted) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Insiden & Kejadian Darurat</h1>
          <div className="flex gap-2">
            <Button disabled>
              Inisiasi Insiden Baru
            </Button>
          </div>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Insiden & Kejadian Darurat</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewIncidentForm(true)}>
            Inisiasi Insiden Baru
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Daftar Insiden</TabsTrigger>
          <TabsTrigger value="assessments">Assessment Data</TabsTrigger>
          <TabsTrigger value="archive">Arsip</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insiden Aktif</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.filter(incident => incident.status === "active").map((incident) => {
                      const incidentAssessments = assessments.filter(assessment => assessment.incidentId === incident.id)
                      const latestAssessment = incidentAssessments[0] // Most recent assessment

                      return (
                        <TableRow key={incident.id}>
                          <TableCell>{incident.type}</TableCell>
                          <TableCell>{incident.location}</TableCell>
                          <TableCell>{new Date(incident.date).toLocaleString("id-ID")}</TableCell>
                          <TableCell>{getStatusBadge(incident.status)}</TableCell>
                          <TableCell>
                            {incidentAssessments.length > 0 ? (
                              <div className="space-y-1">
                                <Badge variant="default" className="text-xs bg-green-600">
                                  ✓ Assessment ({incidentAssessments.length})
                                </Badge>
                                {latestAssessment && latestAssessment.type === "bencana" && latestAssessment.data && (
                                  <div className="text-xs text-muted-foreground">
                                    Korban: {latestAssessment.data.jumlahKorbanMeninggal || 0} meninggal,
                                    {latestAssessment.data.jumlahKorbanLukaBerat || 0} luka berat
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Menunggu Assessment
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                                Detail
                              </Button>
                              {incidentAssessments.length > 0 && (
                                <Button variant="outline" size="sm" onClick={() => handleExportReport(incident)}>
                                  Export PDF
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Assessment Lengkap</CardTitle>
              <p className="text-sm text-muted-foreground">
                Semua data assessment yang telah dikumpulkan dari database, ditampilkan secara lengkap
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Linked Assessments (grouped by incidents) */}
                {incidents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">📎 Assessment Terhubung dengan Insiden</h3>
                    {incidents.map((incident) => {
                      const incidentAssessments = assessments.filter(assessment => assessment.incidentId === incident.id)

                      if (incidentAssessments.length === 0) return null

                      return (
                        <div key={incident.id} className="border rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{incident.type}</h4>
                              <p className="text-sm text-muted-foreground">{incident.location}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(incident.date).toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(incident.status)}
                              <Badge variant="outline" className="text-xs">
                                {incidentAssessments.length} Assessment
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {incidentAssessments.map((assessment, index) => (
                              <AssessmentCard key={assessment.id} assessment={assessment} index={index} />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Standalone Assessments (not linked to incidents) */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">📋 Assessment Mandiri</h3>
                  <div className="space-y-4">
                    {assessments
                      .filter(assessment => !assessment.incidentId)
                      .map((assessment, index) => (
                        <AssessmentCard key={assessment.id} assessment={assessment} index={index} />
                      ))}
                  </div>

                  {assessments.filter(assessment => !assessment.incidentId).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Belum ada assessment mandiri</p>
                      <p className="text-sm">Assessment yang tidak dihubungkan dengan insiden akan muncul di sini</p>
                    </div>
                  )}
                </div>

                {assessments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada data assessment</p>
                    <p className="text-sm">Data assessment akan muncul setelah petugas melakukan penilaian di lapangan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insiden Arsip</CardTitle>
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
                  {incidents.filter(incident => incident.status === "closed").map((incident) => {
                    const incidentAssessments = assessments.filter(assessment => assessment.incidentId === incident.id)
                    return (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>{incident.location}</TableCell>
                        <TableCell>{new Date(incident.date).toLocaleString("id-ID")}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                              Detail
                            </Button>
                            {incidentAssessments.length > 0 && (
                              <Button variant="outline" size="sm" onClick={() => handleExportReport(incident)}>
                                Export PDF
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Incident Dialog */}
      <Dialog open={showNewIncidentForm} onOpenChange={setShowNewIncidentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inisiasi Insiden Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Jenis Insiden</Label>
              <Select value={newIncident.type} onValueChange={(value) => setNewIncident({...newIncident, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis insiden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bencana Alam">Bencana Alam</SelectItem>
                  <SelectItem value="Kecelakaan">Kecelakaan</SelectItem>
                  <SelectItem value="Darurat Medis">Darurat Medis</SelectItem>
                  <SelectItem value="Konflik Sosial">Konflik Sosial</SelectItem>
                  <SelectItem value="Kebakaran">Kebakaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lokasi</Label>
              <Input
                placeholder="Masukkan lokasi insiden"
                value={newIncident.location}
                onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
              />
            </div>
            <div>
              <Label>Waktu Kejadian</Label>
              <Input
                type="datetime-local"
                value={newIncident.date}
                onChange={(e) => setNewIncident({...newIncident, date: e.target.value})}
              />
            </div>
            <div>
              <Label>Deskripsi Awal</Label>
              <Textarea
                placeholder="Jelaskan insiden secara singkat"
                value={newIncident.description}
                onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
              />
            </div>
            <div>
              <Label>Jumlah Korban (perkiraan)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newIncident.victims}
                onChange={(e) => setNewIncident({...newIncident, victims: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewIncidentForm(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateIncident}>
                Buat Insiden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incident Details Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Insiden</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Jenis Insiden</Label>
                  <p className="text-sm">{selectedIncident.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedIncident.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lokasi</Label>
                  <p className="text-sm">{selectedIncident.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Waktu Kejadian</Label>
                  <p className="text-sm">{new Date(selectedIncident.date).toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Deskripsi</Label>
                <p className="text-sm mt-1">{selectedIncident.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Timeline & Riwayat</h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Inisiasi</Badge>
                      <span className="text-sm text-gray-500">{new Date(selectedIncident.createdAt).toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-sm">Insiden diinisiasi oleh posko</p>
                  </div>
                  {/* Assessment data would be shown here */}
                  {(() => {
                    const incidentAssessments = assessments.filter(assessment => assessment.incidentId === selectedIncident.id)
                    return incidentAssessments.length > 0 ? (
                      <div className="border-l-2 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Assessment</Badge>
                          <span className="text-sm text-gray-500">{new Date(incidentAssessments[0].createdAt).toLocaleString("id-ID")}</span>
                        </div>
                        <p className="text-sm">Assessment telah dilakukan oleh {incidentAssessments[0].user?.namaLengkap || 'petugas'}</p>

                        {/* Display assessment data */}
                        {incidentAssessments[0].type === "bencana" && incidentAssessments[0].data && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-medium text-sm">Data Assessment:</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Jenis Bencana: {incidentAssessments[0].data.jenisBencana || '-'}</div>
                              <div>Meninggal: {incidentAssessments[0].data.jumlahKorbanMeninggal || 0}</div>
                              <div>Luka Berat: {incidentAssessments[0].data.jumlahKorbanLukaBerat || 0}</div>
                              <div>Luka Ringan: {incidentAssessments[0].data.jumlahKorbanLukaRingan || 0}</div>
                              <div>Rumah Rusak Berat: {incidentAssessments[0].data.rumahRusakBerat || 0}</div>
                              <div>Rumah Rusak Ringan: {incidentAssessments[0].data.rumahRusakRingan || 0}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border-l-2 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Assessment</Badge>
                          <span className="text-sm text-gray-500">Menunggu data assessment</span>
                        </div>
                        <p className="text-sm">Menunggu laporan dari petugas assessment</p>
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Komunikasi Internal</h3>
                <div className="space-y-4">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedIncident.communications?.map((comm) => (
                      <div key={comm.id} className="border-l-2 border-gray-300 pl-3">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{comm.user.namaLengkap}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comm.createdAt).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comm.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Tambahkan catatan komunikasi..."
                      className="flex-1"
                      value={newCommunication}
                      onChange={(e) => setNewCommunication(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleAddCommunication}
                      disabled={!newCommunication.trim()}
                    >
                      Kirim
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedIncident(null)}>
                  Tutup
                </Button>
                <Button variant="destructive">
                  Tutup Insiden
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  )
}
