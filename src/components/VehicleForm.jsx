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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const vehicleSchema = z.object({
  // Informasi Kendaraan
  jenisKendaraan: z.enum(["Ambulans", "Mobil Operasional", "Motor", "Lainnya"]),
  nomorPolisi: z.string().min(1, "Nomor polisi wajib diisi"),
  nomorLambung: z.string().optional(),
  posko: z.string().min(1, "Posko wajib diisi"),

  // Kondisi Fisik
  kondisiBodi: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"]),
  kondisiBan: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"]),
  kondisiMesin: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"]),
  kondisiInterior: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"]),

  // Sistem Keselamatan
  sabukPengaman: z.boolean(),
  airbag: z.boolean(),
  lampuRem: z.boolean(),
  lampuSen: z.boolean(),
  lampuUtama: z.boolean(),
  klakson: z.boolean(),
  spion: z.boolean(),

  // Peralatan Medis (khusus ambulans)
  brankar: z.boolean().optional(),
  tabungOksigen: z.boolean().optional(),
  defibrillator: z.boolean().optional(),
  alatP3K: z.boolean().optional(),
  ventilator: z.boolean().optional(),

  // Bahan Bakar & Oli
  bahanBakar: z.enum(["Penuh", "3/4", "1/2", "1/4", "Kosong"]),
  oliMesin: z.enum(["Baik", "Perlu Diganti"]),
  oliRem: z.enum(["Baik", "Perlu Diganti"]),

  // Dokumentasi
  stnk: z.boolean(),
  simPengemudi: z.boolean(),
  suratTugas: z.boolean(),
  kartuPengujian: z.boolean(),

  // Catatan
  catatan: z.string().optional(),

  // Petugas Pemeriksa
  namaPetugas: z.string().min(1, "Nama petugas wajib diisi"),
  tanggalPemeriksaan: z.string().min(1, "Tanggal pemeriksaan wajib diisi"),
})

export default function VehicleForm({ onSubmit }) {
  const { toast } = useToast()
  const [isAmbulance, setIsAmbulance] = useState(false)

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      jenisKendaraan: "",
      nomorPolisi: "",
      nomorLambung: "",
      posko: "",
      kondisiBodi: "",
      kondisiBan: "",
      kondisiMesin: "",
      kondisiInterior: "",
      sabukPengaman: false,
      airbag: false,
      lampuRem: false,
      lampuSen: false,
      lampuUtama: false,
      klakson: false,
      spion: false,
      brankar: false,
      tabungOksigen: false,
      defibrillator: false,
      alatP3K: false,
      ventilator: false,
      bahanBakar: "",
      oliMesin: "",
      oliRem: "",
      stnk: false,
      simPengemudi: false,
      suratTugas: false,
      kartuPengujian: false,
      catatan: "",
      namaPetugas: "",
      tanggalPemeriksaan: new Date().toISOString().split('T')[0],
    },
  })

  const onFormSubmit = async (data) => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "available" // Default status untuk kendaraan baru
        }),
      })
      const result = await response.json()
      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Data kendaraan berhasil disimpan.",
          duration: 3000,
        })
        onSubmit()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal menyimpan data kendaraan.",
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

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Informasi Kendaraan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Kendaraan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jenisKendaraan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kendaraan</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setIsAmbulance(value === "Ambulans")
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis kendaraan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ambulans">Ambulans</SelectItem>
                          <SelectItem value="Mobil Operasional">Mobil Operasional</SelectItem>
                          <SelectItem value="Motor">Motor</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomorPolisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Polisi</FormLabel>
                      <FormControl>
                        <Input placeholder="B 1234 ABC" {...field} />
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
                      <FormLabel>Nomor Lambung</FormLabel>
                      <FormControl>
                        <Input placeholder="Opsional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="posko"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posko</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama posko" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Kondisi Fisik */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kondisi Fisik Kendaraan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="kondisiBodi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi Bodi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                          <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kondisiBan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi Ban</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                          <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kondisiMesin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi Mesin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                          <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kondisiInterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi Interior</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                          <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sistem Keselamatan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sistem Keselamatan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sabukPengaman"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Sabuk Pengaman</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airbag"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Airbag</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lampuRem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Lampu Rem</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lampuSen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Lampu Sen</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lampuUtama"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Lampu Utama</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="klakson"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Klakson</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Spion</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Peralatan Medis (khusus ambulans) */}
          {isAmbulance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peralatan Medis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brankar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Brankar</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tabungOksigen"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tabung Oksigen</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defibrillator"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Defibrillator</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alatP3K"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Alat P3K</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ventilator"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ventilator</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bahan Bakar & Oli */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bahan Bakar & Oli</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bahanBakar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bahan Bakar</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Penuh">Penuh</SelectItem>
                          <SelectItem value="3/4">3/4</SelectItem>
                          <SelectItem value="1/2">1/2</SelectItem>
                          <SelectItem value="1/4">1/4</SelectItem>
                          <SelectItem value="Kosong">Kosong</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oliMesin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oli Mesin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Perlu Diganti">Perlu Diganti</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oliRem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oli Rem</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kondisi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Perlu Diganti">Perlu Diganti</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dokumentasi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dokumentasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stnk"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>STNK</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="simPengemudi"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>SIM Pengemudi</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="suratTugas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Surat Tugas</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kartuPengujian"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kartu Pengujian</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Catatan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catatan</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="catatan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Catatan tambahan jika ada"
                        {...field}
                        rows="3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Petugas Pemeriksa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Petugas Pemeriksa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="submit" size="lg">
              Simpan Data Kendaraan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
