"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorHandphone: "",
    spesialisasi: "",
    role: "Petugas",
    subRole: "",
    alamat: "",
    golonganDarah: "A+",
    jenisKelamin: "Laki-laki",
    pesan: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: user?.emailAddresses[0]?.emailAddress
        })
      })

      if (response.ok) {
        router.push('/pending-approval')
      } else {
        toast({
          title: "Error",
          description: "Gagal mendaftar. Silakan coba lagi.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Lengkapi Data Relawan
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Silakan lengkapi informasi Anda untuk bergabung sebagai relawan PMI
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nama Lengkap *</Label>
                <Input
                  required
                  placeholder="Masukkan nama lengkap"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                />
              </div>
              <div>
                <Label>Nomor Handphone *</Label>
                <Input
                  required
                  placeholder="081234567890"
                  value={formData.nomorHandphone}
                  onChange={(e) => setFormData({...formData, nomorHandphone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Jenis Kelamin</Label>
                <Select value={formData.jenisKelamin} onValueChange={(value) => setFormData({...formData, jenisKelamin: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Golongan Darah</Label>
                <Select value={formData.golonganDarah} onValueChange={(value) => setFormData({...formData, golonganDarah: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih golongan darah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Alamat</Label>
              <Textarea
                placeholder="Masukkan alamat lengkap"
                value={formData.alamat}
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                rows={3}
              />
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Spesialisasi *</Label>
                <Select value={formData.spesialisasi} onValueChange={(value) => setFormData({...formData, spesialisasi: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih spesialisasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dokter">Dokter</SelectItem>
                    <SelectItem value="Perawat">Perawat</SelectItem>
                    <SelectItem value="Paramedis">Paramedis</SelectItem>
                    <SelectItem value="Driver Ambulance">Driver Ambulance</SelectItem>
                    <SelectItem value="Koordinator">Koordinator</SelectItem>
                    <SelectItem value="Administrasi">Administrasi</SelectItem>
                    <SelectItem value="Logistik">Logistik</SelectItem>
                    <SelectItem value="Komunikasi">Komunikasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petugas">Petugas</SelectItem>
                    <SelectItem value="Koordinator">Koordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.role === "Petugas" && (
              <div>
                <Label>Sub Role</Label>
                <Select value={formData.subRole} onValueChange={(value) => setFormData({...formData, subRole: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sub role (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="posko">Posko</SelectItem>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="tanggap-darurat-bencana">Tanggap Darurat Bencana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Pesan (Opsional)</Label>
              <Textarea
                placeholder="Berikan pesan atau catatan tambahan"
                value={formData.pesan}
                onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Mendaftar..." : "Daftar sebagai Relawan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
