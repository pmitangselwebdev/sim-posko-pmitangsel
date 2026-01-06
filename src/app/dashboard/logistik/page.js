"use client"

import { useState } from "react"
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

const checklistSchema = z.object({
  nomorPolisi: z.string().min(1, "Nomor polisi wajib diisi"),
  nomorLambung: z.string(),
  jenisKendaraan: z.enum(["Ambulans", "Kendaraan Operasional", "Motor Mobile"]),
  posko: z.string().min(1, "Posko wajib diisi"),
  namaPetugas: z.string().min(1, "Nama petugas wajib diisi"),
  jabatan: z.enum(["Sopir", "Mekanik", "Logistik", "Relawan Medis"]),
  tanggalPemeriksaan: z.string(),
  waktuPemeriksaan: z.string(),
  odometer: z.string(),
  // Kondisi Fisik
  bodyKendaraan: z.enum(["Baik", "Perlu perbaikan"]),
  catatanBody: z.string(),
  lampuDepan: z.enum(["✅", "❌"]),
  lampuBelakang: z.enum(["✅", "❌"]),
  klakson: z.enum(["✅", "❌"]),
  wiper: z.enum(["✅", "❌"]),
  spion: z.enum(["✅", "❌"]),
  banDepan: z.enum(["✅", "❌"]),
  banBelakang: z.enum(["✅", "❌"]),
  banCadangan: z.enum(["✅", "❌"]),
  tekananAngin: z.enum(["✅", "❌"]),
  rem: z.enum(["✅", "❌"]),
  pintuJendela: z.enum(["✅", "❌"]),
  sirineLampuRotator: z.enum(["✅", "❌"]),
  apar: z.enum(["✅", "❌"]),
  // Kondisi Mesin
  oliMesin: z.enum(["✅", "❌"]),
  airRadiator: z.enum(["✅", "❌"]),
  aki: z.enum(["✅", "❌"]),
  lampuIndikator: z.enum(["✅", "❌"]),
  bbm: z.enum(["✅", "❌"]),
  ac: z.enum(["✅", "❌"]),
  // Peralatan Medis
  tasP3K: z.enum(["✅", "❌"]),
  tanduUtama: z.enum(["✅", "❌"]),
  tanduLipat: z.enum(["✅", "❌"]),
  oksigen: z.enum(["✅", "❌"]),
  suction: z.enum(["✅", "❌"]),
  infus: z.enum(["✅", "❌"]),
  tensimeter: z.enum(["✅", "❌"]),
  blanket: z.enum(["✅", "❌"]),
  lampuPenerangan: z.enum(["✅", "❌"]),
  alatPelindung: z.enum(["✅", "❌"]),
  // Dokumen
  stnk: z.enum(["✅", "❌"]),
  kir: z.enum(["✅", "❌"]),
  asuransi: z.enum(["✅", "❌"]),
  bukuServis: z.enum(["✅", "❌"]),
  // Catatan
  catatanTambahan: z.string(),
  fotoDepan: z.string(),
  fotoKabin: z.string(),
  fotoOdometer: z.string(),
  statusKelayakan: z.enum(["Layak Operasi", "Perlu Servis", "Tidak Layak"]),
  disetujuiOleh: z.enum(["Koordinator Armada", "Logistik"]),
})

export default function Logistik() {
  const [activeTab, setActiveTab] = useState("checklist")

  const form = useForm({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      nomorPolisi: "",
      nomorLambung: "",
      jenisKendaraan: "",
      posko: "",
      namaPetugas: "",
      jabatan: "",
      tanggalPemeriksaan: new Date().toISOString().split('T')[0],
      waktuPemeriksaan: new Date().toTimeString().slice(0, 5),
      odometer: "",
      bodyKendaraan: "",
      catatanBody: "",
      lampuDepan: "",
      lampuBelakang: "",
      klakson: "",
      wiper: "",
      spion: "",
      banDepan: "",
      banBelakang: "",
      banCadangan: "",
      tekananAngin: "",
      rem: "",
      pintuJendela: "",
      sirineLampuRotator: "",
      apar: "",
      oliMesin: "",
      airRadiator: "",
      aki: "",
      lampuIndikator: "",
      bbm: "",
      ac: "",
      tasP3K: "",
      tanduUtama: "",
      tanduLipat: "",
      oksigen: "",
      suction: "",
      infus: "",
      tensimeter: "",
      blanket: "",
      lampuPenerangan: "",
      alatPelindung: "",
      stnk: "",
      kir: "",
      asuransi: "",
      bukuServis: "",
      catatanTambahan: "",
      fotoDepan: "",
      fotoKabin: "",
      fotoOdometer: "",
      statusKelayakan: "",
      disetujuiOleh: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        alert("Logistics form submitted successfully!")
      } else {
        alert(result.error || "Error submitting form")
      }
    } catch (error) {
      alert("Network error")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Logistik dan Kendaraan</h1>
      <div className="flex space-x-4 mb-4">
        <Button variant={activeTab === "checklist" ? "default" : "outline"} onClick={() => setActiveTab("checklist")}>
          Checklist Armada
        </Button>
        <Button variant={activeTab === "buffer" ? "default" : "outline"} onClick={() => setActiveTab("buffer")}>
          Buffer Stock
        </Button>
      </div>

      {activeTab === "checklist" && (
        <Card>
          <CardHeader>
            <CardTitle>Form Checklist Kelayakan Ambulans PMI Kota Tangerang Selatan</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Identitas Kendaraan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nomorPolisi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Polisi</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nomorLambung"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Lambung / Unit</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jenisKendaraan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Kendaraan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Ambulans">Ambulans</SelectItem>
                              <SelectItem value="Kendaraan Operasional">Kendaraan Operasional</SelectItem>
                              <SelectItem value="Motor Mobile">Motor Mobile</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="posko"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posko / Unit</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="namaPetugas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Petugas Pemeriksa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jabatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan / Tim</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sopir">Sopir</SelectItem>
                              <SelectItem value="Mekanik">Mekanik</SelectItem>
                              <SelectItem value="Logistik">Logistik</SelectItem>
                              <SelectItem value="Relawan Medis">Relawan Medis</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tanggalPemeriksaan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Pemeriksaan</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="waktuPemeriksaan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Pemeriksaan</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="odometer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Odometer / KM Terakhir</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">A. Kondisi Fisik Kendaraan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Body kendaraan tidak rusak / penyok</Label>
                      <FormField
                        control={form.control}
                        name="bodyKendaraan"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Baik">✅ Baik</SelectItem>
                                <SelectItem value="Perlu perbaikan">⚠️ Perlu perbaikan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="catatanBody"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Catatan" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Add more fields for other components */}
                    <FormField
                      control={form.control}
                      name="lampuDepan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lampu depan / belakang berfungsi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="✅">✅</SelectItem>
                              <SelectItem value="❌">❌</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="klakson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Klakson berfungsi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="✅">✅</SelectItem>
                              <SelectItem value="❌">❌</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Continue with other fields... */}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">F. Hasil & Tindak Lanjut</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="statusKelayakan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status kelayakan kendaraan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Layak Operasi">✅ Layak Operasi</SelectItem>
                              <SelectItem value="Perlu Servis">⚠️ Perlu Servis</SelectItem>
                              <SelectItem value="Tidak Layak">❌ Tidak Layak</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disetujuiOleh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disetujui oleh</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Koordinator Armada">Koordinator Armada</SelectItem>
                              <SelectItem value="Logistik">Logistik</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">Submit Checklist</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {activeTab === "buffer" && (
        <Card>
          <CardHeader>
            <CardTitle>Ketersediaan Buffer Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manajemen buffer stock akan diimplementasikan dengan tracking stok darah dan logistik.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
