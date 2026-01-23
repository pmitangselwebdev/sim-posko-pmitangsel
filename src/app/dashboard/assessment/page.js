"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMounted } from "@/hooks/use-mounted"

const assessmentSchema = z.object({
  jenisBencana: z.enum(["Banjir", "Longsor", "Kebakaran", "Konflik"]),
  waktuKejadian: z.string().min(1, "Waktu kejadian wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  namaPetugas: z.string().min(1, "Nama petugas wajib diisi"),
  jumlahKorbanMeninggal: z.string(),
  jumlahKorbanLukaBerat: z.string(),
  jumlahKorbanLukaRingan: z.string(),
  jumlahKorbanHilang: z.string(),
  pengungsi: z.enum(["ada", "tidak"]),
  lokasiPengungsian: z.string().optional(),
  jumlahPengungsi: z.string().optional(),
  rumahRusakBerat: z.string(),
  rumahRusakRingan: z.string(),
  jalan: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  jembatan: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  kendaraanUmum: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  internet: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  teleponSeluler: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  kantorPos: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  teleponFaxTelegram: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  fasilitasKesehatan: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  listrik: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  air: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  sekolah: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  tempatIbadah: z.enum(["Berfungsi", "Tidak Berfungsi"]),
  situasiKeamanan: z.string(),
  tindakanPMI: z.string(),
  tindakanInstansiLain: z.string(),
  kebutuhanPMI: z.string(),
  kebutuhanKorban: z.string(),
  kontak: z.array(z.object({
    nama: z.string(),
    jabatan: z.string(),
    nomorTelepon: z.string()
  })).optional(),
  dokumentasi: z.string().optional(),
})

export default function Assessment() {
  const mounted = useMounted()
  const [assessmentType, setAssessmentType] = useState("bencana")
  const [pengungsi, setPengungsi] = useState("tidak")
  const [kontak, setKontak] = useState([{ nama: "", jabatan: "", nomorTelepon: "" }])
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showMinimap, setShowMinimap] = useState(false)
  const [currentCoords, setCurrentCoords] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [selectedIncidentId, setSelectedIncidentId] = useState("")

  const form = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      jenisBencana: "",
      waktuKejadian: "",
      lokasi: "",
      latitude: "",
      longitude: "",
      namaPetugas: "",
      jumlahKorbanMeninggal: "",
      jumlahKorbanLukaBerat: "",
      jumlahKorbanLukaRingan: "",
      jumlahKorbanHilang: "",
      pengungsi: "tidak",
      lokasiPengungsian: "",
      jumlahPengungsi: "",
      rumahRusakBerat: "",
      rumahRusakRingan: "",
      jalan: "",
      jembatan: "",
      kendaraanUmum: "",
      internet: "",
      teleponSeluler: "",
      kantorPos: "",
      teleponFaxTelegram: "",
      fasilitasKesehatan: "",
      listrik: "",
      air: "",
      sekolah: "",
      tempatIbadah: "",
      situasiKeamanan: "",
      tindakanPMI: "",
      tindakanInstansiLain: "",
      kebutuhanPMI: "",
      kebutuhanKorban: "",
      kontak: [],
      dokumentasi: "",
    },
  })

  // Fetch incidents on component mount
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch("/api/incidents")
        if (response.ok) {
          const data = await response.json()
          setIncidents(data.filter(incident => incident.status === "active"))
        }
      } catch (error) {
        console.error("Error fetching incidents:", error)
      }
    }
    fetchIncidents()
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        incidentId: selectedIncidentId || null,
        kontak: kontak.filter(k => k.nama && k.jabatan && k.nomorTelepon)
      }

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (response.ok) {
        alert("Assessment submitted successfully!")
        // Reset form
        form.reset()
        setSelectedIncidentId("")
        setKontak([{ nama: "", jabatan: "", nomorTelepon: "" }])
        setShowMinimap(false)
        setCurrentCoords(null)
      } else {
        alert(result.error || "Error submitting assessment")
      }
    } catch (error) {
      alert("Network error")
    }
  }

  const addKontak = () => {
    setKontak([...kontak, { nama: "", jabatan: "", nomorTelepon: "" }])
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        form.setValue("latitude", latitude.toString())
        form.setValue("longitude", longitude.toString())
        setCurrentCoords({ lat: latitude, lng: longitude })
        setShowMinimap(true)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Error getting location: " + error.message)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Only render components after hydration to prevent classList errors
  if (!mounted) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Petugas Assessment</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Petugas Assessment</h1>

      {/* Assessment Type Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Jenis Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={assessmentType} onValueChange={setAssessmentType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih jenis assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bencana">Assessment Bencana</SelectItem>
              <SelectItem value="ambulance">Assessment Ambulance Darurat/Kecelakaan</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Incident Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Link ke Insiden Aktif (Opsional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pilih insiden yang sedang aktif untuk menghubungkan assessment ini. Data assessment akan ditampilkan di halaman laporan insiden.
          </p>
        </CardHeader>
        <CardContent>
          <Select value={selectedIncidentId || "none"} onValueChange={(value) => setSelectedIncidentId(value === "none" ? "" : value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih insiden aktif (opsional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Tidak dihubungkan ke insiden</SelectItem>
              {incidents.map((incident) => (
                <SelectItem key={incident.id} value={incident.id}>
                  {incident.type} - {incident.location} ({new Date(incident.date).toLocaleDateString("id-ID")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {incidents.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Tidak ada insiden aktif. Assessment akan disimpan sebagai data mandiri.
            </p>
          )}
        </CardContent>
      </Card>

      {assessmentType === "bencana" && (
        <Card>
          <CardHeader>
            <CardTitle>Form Rapid Assessment Bencana</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Gambaran Umum Bencana</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="jenisBencana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Bencana</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis bencana" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Banjir">Banjir</SelectItem>
                            <SelectItem value="Longsor">Longsor</SelectItem>
                            <SelectItem value="Kebakaran">Kebakaran</SelectItem>
                            <SelectItem value="Konflik">Konflik</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="waktuKejadian"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waktu Kejadian</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lokasi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi</FormLabel>
                        <FormControl>
                          <Input placeholder="Provinsi / Kota / Kecamatan / Kelurahan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Koordinat Lokasi</Label>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Latitude" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Longitude" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="px-3"
                      >
                        {isGettingLocation ? "📍..." : "📍"}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Klik ikon lokasi untuk mendapatkan koordinat saat ini</p>

                    {/* Minimap Preview */}
                    {showMinimap && currentCoords && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium mb-2 block">Preview Lokasi</Label>
                        <div className="border rounded-lg overflow-hidden" style={{ height: '200px', width: '100%' }}>
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentCoords.lng - 0.01},${currentCoords.lat - 0.01},${currentCoords.lng + 0.01},${currentCoords.lat + 0.01}&layer=mapnik&marker=${currentCoords.lat},${currentCoords.lng}`}
                            allowFullScreen
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Koordinat: {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="namaPetugas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Petugas</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Informasi Umum</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="jumlahKorbanMeninggal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meninggal</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jumlahKorbanLukaBerat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luka Berat</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jumlahKorbanLukaRingan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luka Ringan</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jumlahKorbanHilang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hilang</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="pengungsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pengungsi</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); setPengungsi(value) }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ada">Ada</SelectItem>
                            <SelectItem value="tidak">Tidak</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {pengungsi === "ada" && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="lokasiPengungsian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokasi Pengungsian</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jumlahPengungsi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Pengungsi</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Dampak Sarana dan Prasarana</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rumahRusakBerat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rumah Rusak Berat</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rumahRusakRingan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rumah Rusak Ringan</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">Akses Transportasi</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="jalan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jalan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jembatan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jembatan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kendaraanUmum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kendaraan Umum</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Akses Komunikasi</Label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="internet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Internet</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teleponSeluler"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telepon Seluler</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kantorPos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kantor Pos</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teleponFaxTelegram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telepon Fax Telegram</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Sarana Umum</Label>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="fasilitasKesehatan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fasilitas Kesehatan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="listrik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Listrik</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="air"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Air</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sekolah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sekolah</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tempatIbadah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempat Ibadah</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Berfungsi">Berfungsi</SelectItem>
                                <SelectItem value="Tidak Berfungsi">Tidak Berfungsi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Situasi Keamanan</h3>
                <FormField
                  control={form.control}
                  name="situasiKeamanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jelaskan secara singkat</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Tindakan yang sudah dilakukan</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tindakanPMI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Untuk PMI</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tindakanInstansiLain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Untuk Instansi Lain</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Kebutuhan Mendesak</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="kebutuhanPMI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PMI</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kebutuhanKorban"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Korban Terdampak</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Kontak</h3>
                {kontak.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input placeholder="Nama" value={kontak[index].nama} onChange={(e) => {
                      const newKontak = [...kontak]
                      newKontak[index].nama = e.target.value
                      setKontak(newKontak)
                    }} />
                    <Input placeholder="Jabatan" value={kontak[index].jabatan} onChange={(e) => {
                      const newKontak = [...kontak]
                      newKontak[index].jabatan = e.target.value
                      setKontak(newKontak)
                    }} />
                    <Input placeholder="Nomor Telepon" value={kontak[index].nomorTelepon} onChange={(e) => {
                      const newKontak = [...kontak]
                      newKontak[index].nomorTelepon = e.target.value
                      setKontak(newKontak)
                    }} />
                  </div>
                ))}
                <Button type="button" onClick={addKontak}>Tambah Kontak</Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Dokumentasi</h3>
                <FormField
                  control={form.control}
                  name="dokumentasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload foto</FormLabel>
                      <FormControl>
                        <Input type="file" multiple {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Submit Assessment</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      )}

      {assessmentType === "ambulance" && (
        <Card>
          <CardHeader>
            <CardTitle>Form Assessment Ambulance Darurat/Kecelakaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Waktu Kejadian</Label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <Label>Lokasi</Label>
                  <Input placeholder="Lokasi kejadian" />
                </div>
                <div>
                  <Label>Jenis Kejadian</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kejadian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kecelakaan-lalu-lintas">Kecelakaan Lalu Lintas</SelectItem>
                      <SelectItem value="kecelakaan-kerja">Kecelakaan Kerja</SelectItem>
                      <SelectItem value="darurat-medis">Darurat Medis</SelectItem>
                      <SelectItem value="kecelakaan-rumah-tangga">Kecelakaan Rumah Tangga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nama Petugas</Label>
                  <Input placeholder="Nama petugas assessment" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Informasi Korban</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Jumlah Korban</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Korban Luka Berat</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Korban Luka Ringan</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Korban Meninggal</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Kondisi Lokasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Akses Jalan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kondisi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lancar">Lancar</SelectItem>
                        <SelectItem value="padat">Padat</SelectItem>
                        <SelectItem value="tersumbat">Tersumbat</SelectItem>
                        <SelectItem value="rusak">Rusak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cuaca</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kondisi cuaca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cerah">Cerah</SelectItem>
                        <SelectItem value="hujan">Hujan</SelectItem>
                        <SelectItem value="kabut">Kabut</SelectItem>
                        <SelectItem value="berangin">Berangin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Kebutuhan Ambulance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Jumlah Ambulance Dibutuhkan</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Jenis Ambulance</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Life Support</SelectItem>
                        <SelectItem value="advanced">Advanced Life Support</SelectItem>
                        <SelectItem value="neonatal">Neonatal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Urgensi</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tingkat urgensi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rendah">Rendah</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="tinggi">Tinggi</SelectItem>
                        <SelectItem value="kritis">Kritis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Tindakan yang Telah Dilakukan</h3>
                <Textarea placeholder="Jelaskan tindakan PMI yang telah dilakukan" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Kebutuhan Tambahan</h3>
                <Textarea placeholder="Jelaskan kebutuhan tambahan jika ada" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Kontak Darurat</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Nama kontak" />
                  <Input placeholder="Jabatan" />
                  <Input placeholder="Nomor telepon" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Dokumentasi</h3>
                <Input type="file" multiple />
              </div>

              <Button className="w-full">Submit Assessment Ambulance</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
