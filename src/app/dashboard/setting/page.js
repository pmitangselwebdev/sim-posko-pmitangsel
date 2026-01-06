"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { Camera, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Setting() {
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [userData, setUserData] = useState(null)
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

  useEffect(() => {
    fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) return

    try {
      const response = await fetch(`/api/users/profile?email=${user.emailAddresses[0].emailAddress}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        setFormData({
          namaLengkap: data.namaLengkap || "",
          nomorHandphone: data.nomorHandphone || "",
          spesialisasi: data.spesialisasi || "",
          role: data.role || "Petugas",
          subRole: data.subRole || "",
          alamat: data.alamat || "",
          golonganDarah: data.golonganDarah || "A+",
          jenisKelamin: data.jenisKelamin || "Laki-laki",
          pesan: data.pesan || ""
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log('Form submitted, showing toast...')

    try {
      // Store original data for comparison
      const originalData = { ...userData }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.emailAddresses[0]?.emailAddress,
          ...formData
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        console.log('Original data:', originalData)
        console.log('Form data:', formData)

        // Check if any data actually changed by comparing formData with original userData
        const hasChanges = Object.keys(formData).some(key => {
          // Skip id and timestamps
          if (key === 'id' || key === 'createdAt' || key === 'updatedAt') return false
          return originalData[key] !== formData[key]
        })
        console.log('Has changes:', hasChanges)

        if (hasChanges) {
          console.log('Showing success message')
          setMessage({
            type: 'success',
            title: 'Berhasil!',
            description: 'Profil berhasil diperbarui.'
          })
          fetchUserData()
          // Trigger sidebar refresh by dispatching a custom event
          window.dispatchEvent(new CustomEvent('profileUpdated'))

          // Clear message after 5 seconds
          setTimeout(() => setMessage(null), 5000)
        } else {
          console.log('Showing no changes message')
          setMessage({
            type: 'info',
            title: 'Tidak ada perubahan',
            description: 'Tidak ada perubahan yang disimpan.'
          })

          // Clear message after 3 seconds
          setTimeout(() => setMessage(null), 3000)
        }
      } else {
        console.log('Showing error toast')
        toast({
          title: "Gagal",
          description: "Gagal memperbarui profil. Silakan coba lagi.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log('Showing catch error toast')
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('image', file)
    formDataUpload.append('email', user?.emailAddresses[0]?.emailAddress)

    try {
      const response = await fetch('/api/users/upload-avatar', {
        method: 'POST',
        body: formDataUpload
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Foto profil berhasil diperbarui.",
        })
        fetchUserData()
      } else {
        toast({
          title: "Gagal",
          description: "Gagal mengupload foto profil. Silakan coba lagi.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat upload. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pengaturan Profil</h1>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : message.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <p className="font-medium">{message.title}</p>
          <p className="text-sm">{message.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Foto Profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={userData?.foto || user?.imageUrl || "/images/default-profile-picture.png"}
                alt={userData?.namaLengkap}
              />
              <AvatarFallback className="text-2xl">
                {userData?.namaLengkap?.charAt(0) || user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                  <Camera className="w-4 h-4" />
                  <span>Ubah Foto</span>
                </div>
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-500 text-center">
                Format: JPG, PNG, GIF<br />
                Maksimal: 5MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
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

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
