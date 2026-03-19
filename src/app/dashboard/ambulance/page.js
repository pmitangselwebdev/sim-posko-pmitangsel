"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AmbulanceReport from "@/components/AmbulanceReport"

const ambulanceSchema = z.object({
  jenisKejadian: z.enum(["Rujukan", "Kecelakaan"]),
  waktuKejadian: z.string().min(1, "Waktu kejadian wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  namaPetugas: z.string().min(1, "Nama petugas wajib diisi"),
  namaKorban: z.string().min(1, "Nama korban wajib diisi"),
  usia: z.string().min(1, "Usia wajib diisi"),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"]),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  nomorTelepon: z.string().min(1, "Nomor telepon wajib diisi"),
  respon: z.enum(["Awas", "Suara", "Nyeri", "Tidak Respon"]),
  nafas: z.enum(["Kuat", "Lemah", "Tidak ada"]),
  frekuensiNafas: z.string(),
  nadi: z.enum(["Kuat", "Lemah", "Tidak ada"]),
  frekuensiNadi: z.string(),
  tekananDarah: z.string(),
  jenisCedera: z.string(),
  keluhan: z.string(),
  obat: z.string(),
  makanMinum: z.string(),
  penyakit: z.string(),
  alergi: z.string(),
  kejadian: z.string(),
  penjelasanTindakan: z.string(),
  statusRujukan: z.enum(["Iya", "Tidak"]),
  lokasiRujukan: z.string().optional(),
})

export default function Ambulance() {
  const form = useForm({
    resolver: zodResolver(ambulanceSchema),
    defaultValues: {
      jenisKejadian: "",
      waktuKejadian: "",
      lokasi: "",
      namaPetugas: "",
      namaKorban: "",
      usia: "",
      jenisKelamin: "",
      alamat: "",
      nomorTelepon: "",
      respon: "",
      nafas: "",
      frekuensiNafas: "",
      nadi: "",
      frekuensiNadi: "",
      tekananDarah: "",
      jenisCedera: "",
      keluhan: "",
      obat: "",
      makanMinum: "",
      penyakit: "",
      alergi: "",
      kejadian: "",
      penjelasanTindakan: "",
      statusRujukan: "Tidak",
      lokasiRujukan: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/ambulance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        alert("Ambulance form submitted successfully!")
      } else {
        alert(result.error || "Error submitting form")
      }
    } catch (error) {
      alert("Network error")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Petugas Ambulance</h1>
      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Form Kartu Luka</TabsTrigger>
          <TabsTrigger value="report">Laporan Kartu Luka</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Form Kartu Luka</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Gambaran Umum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jenisKejadian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Kejadian</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis kejadian" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Rujukan">Rujukan</SelectItem>
                                <SelectItem value="Kecelakaan">Kecelakaan</SelectItem>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaKorban"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Korban</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usia</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jenisKelamin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Kelamin</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="alamat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alamat</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nomorTelepon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
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
                    <h3 className="text-lg font-semibold mb-4">Penilaian Dini</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="respon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Respon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Awas">Awas</SelectItem>
                                <SelectItem value="Suara">Suara</SelectItem>
                                <SelectItem value="Nyeri">Nyeri</SelectItem>
                                <SelectItem value="Tidak Respon">Tidak Respon</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tanda Vital</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="nafas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nafas</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Kuat">Kuat</SelectItem>
                                <SelectItem value="Lemah">Lemah</SelectItem>
                                <SelectItem value="Tidak ada">Tidak ada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="frekuensiNafas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frekuensi Nafas</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nadi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nadi</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Kuat">Kuat</SelectItem>
                                <SelectItem value="Lemah">Lemah</SelectItem>
                                <SelectItem value="Tidak ada">Tidak ada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="frekuensiNadi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frekuensi Nadi</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tekananDarah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tekanan Darah</FormLabel>
                            <FormControl>
                              <Input placeholder="120/80" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Jenis Cedera</h3>
                    <FormField
                      control={form.control}
                      name="jenisCedera"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Jelaskan jenis cedera" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Riwayat Penderita</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="keluhan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Keluhan</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="obat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Obat</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="makanMinum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Makan/Minum</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="penyakit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Penyakit</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="alergi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alergi</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kejadian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kejadian</FormLabel>
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
                    <h3 className="text-lg font-semibold mb-4">Penjelasan Tindakan</h3>
                    <FormField
                      control={form.control}
                      name="penjelasanTindakan"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Status Rujukan</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="statusRujukan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status Rujukan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Iya">Iya</SelectItem>
                                <SelectItem value="Tidak">Tidak</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch("statusRujukan") === "Iya" && (
                        <FormField
                          control={form.control}
                          name="lokasiRujukan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lokasi Rujukan</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Submit Kartu Luka</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <AmbulanceReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
