import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Printer, 
  Eye, 
  Download, 
  Calendar, 
  MapPin, 
  User, 
  Stethoscope,
  FileText 
} from "lucide-react"

export default function AmbulanceReport() {
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ambulance")
      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error("Error fetching ambulance forms:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const printReport = (form) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Kartu Luka - ${form.data.namaKorban}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #666; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .field { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
            .field-label { font-weight: bold; }
            .field-value { color: #333; }
            .full-width { grid-column: 1 / -1; }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">KARTU LUKA</div>
            <div class="subtitle">PMI Kota Tangerang Selatan</div>
          </div>
          
          <div class="section">
            <div class="section-title">Gambaran Umum</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Jenis Kejadian:</span>
                <span class="field-value">${form.data.jenisKejadian}</span>
              </div>
              <div class="field">
                <span class="field-label">Waktu Kejadian:</span>
                <span class="field-value">${formatDate(form.data.waktuKejadian)}</span>
              </div>
              <div class="field full-width">
                <span class="field-label">Lokasi:</span>
                <span class="field-value">${form.data.lokasi}</span>
              </div>
              <div class="field">
                <span class="field-label">Nama Petugas:</span>
                <span class="field-value">${form.data.namaPetugas}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Informasi Umum</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Nama Korban:</span>
                <span class="field-value">${form.data.namaKorban}</span>
              </div>
              <div class="field">
                <span class="field-label">Usia:</span>
                <span class="field-value">${form.data.usia} tahun</span>
              </div>
              <div class="field">
                <span class="field-label">Jenis Kelamin:</span>
                <span class="field-value">${form.data.jenisKelamin}</span>
              </div>
              <div class="field">
                <span class="field-label">Alamat:</span>
                <span class="field-value">${form.data.alamat}</span>
              </div>
              <div class="field">
                <span class="field-label">Nomor Telepon:</span>
                <span class="field-value">${form.data.nomorTelepon}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Penilaian Dini</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Respon:</span>
                <span class="field-value">${form.data.respon}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Tanda Vital</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Nafas:</span>
                <span class="field-value">${form.data.nafas}</span>
              </div>
              <div class="field">
                <span class="field-label">Frekuensi Nafas:</span>
                <span class="field-value">${form.data.frekuensiNafas || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Nadi:</span>
                <span class="field-value">${form.data.nadi}</span>
              </div>
              <div class="field">
                <span class="field-label">Frekuensi Nadi:</span>
                <span class="field-value">${form.data.frekuensiNadi || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Tekanan Darah:</span>
                <span class="field-value">${form.data.tekananDarah || '-'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Jenis Cedera</div>
            <div class="field full-width">
              <span class="field-value">${form.data.jenisCedera || '-'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Riwayat Penderita</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Keluhan:</span>
                <span class="field-value">${form.data.keluhan || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Obat:</span>
                <span class="field-value">${form.data.obat || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Makan/Minum:</span>
                <span class="field-value">${form.data.makanMinum || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Penyakit:</span>
                <span class="field-value">${form.data.penyakit || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Alergi:</span>
                <span class="field-value">${form.data.alergi || '-'}</span>
              </div>
              <div class="field full-width">
                <span class="field-label">Kejadian:</span>
                <span class="field-value">${form.data.kejadian || '-'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Penjelasan Tindakan</div>
            <div class="field full-width">
              <span class="field-value">${form.data.penjelasanTindakan || '-'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Status Rujukan</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Status:</span>
                <span class="field-value">${form.data.statusRujukan}</span>
              </div>
              ${form.data.statusRujukan === 'Iya' ? `
                <div class="field">
                  <span class="field-label">Lokasi Rujukan:</span>
                  <span class="field-value">${form.data.lokasiRujukan || '-'}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Informasi Tambahan</div>
            <div class="grid">
              <div class="field">
                <span class="field-label">Dibuat Oleh:</span>
                <span class="field-value">${form.user?.namaLengkap || 'Petugas'}</span>
              </div>
              <div class="field">
                <span class="field-label">Spesialisasi:</span>
                <span class="field-value">${form.user?.spesialisasi || '-'}</span>
              </div>
              <div class="field">
                <span class="field-label">Tanggal Dibuat:</span>
                <span class="field-value">${formatDate(form.createdAt)}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const downloadPDF = async (form) => {
    try {
      const response = await fetch('/api/reports/ambulance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId: form.id })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `kartu-luka-${form.data.namaKorban}-${new Date().toISOString().slice(0, 10)}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Gagal mengunduh PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Terjadi kesalahan saat mengunduh PDF')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laporan Ambulance</h1>
        <Button onClick={fetchForms} variant="outline">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Forms */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kartu Luka</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] pr-4 overflow-y-auto">
                {forms.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Belum ada data kartu luka
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forms.map((form) => (
                      <div
                        key={form.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedForm?.id === form.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-red-50'
                        }`}
                        onClick={() => setSelectedForm(form)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{form.data.namaKorban}</div>
                            <div className="text-sm text-gray-600">{form.data.namaPetugas}</div>
                          </div>
                          <Badge variant="outline">
                            {form.data.jenisKejadian}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(form.data.waktuKejadian)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {form.data.lokasi}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {form.user?.namaLengkap || 'Petugas'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Form Details */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Kartu Luka - {selectedForm.data.namaKorban}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Dibuat oleh: {selectedForm.user?.namaLengkap || 'Petugas'} • 
                    {formatDate(selectedForm.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => printReport(selectedForm)}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadPDF(selectedForm)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] pr-4 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Gambaran Umum */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Gambaran Umum
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Jenis Kejadian</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.jenisKejadian}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Waktu Kejadian</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{formatDate(selectedForm.data.waktuKejadian)}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Lokasi</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.lokasi}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nama Petugas</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.namaPetugas}</p>
                        </div>
                      </div>
                    </div>

                    {/* Informasi Umum */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informasi Umum
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nama Korban</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.namaKorban}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Usia</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.usia} tahun</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Jenis Kelamin</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.jenisKelamin}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Alamat</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.alamat}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nomor Telepon</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.nomorTelepon}</p>
                        </div>
                      </div>
                    </div>

                    {/* Penilaian Dini */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Penilaian Dini
                      </h3>
                      <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Respon</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.respon}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tanda Vital */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Tanda Vital
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nafas</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.nafas}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Frekuensi Nafas</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.frekuensiNafas || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nadi</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.nadi}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Frekuensi Nadi</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.frekuensiNadi || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Tekanan Darah</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.tekananDarah || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Jenis Cedera */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Jenis Cedera</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p>{selectedForm.data.jenisCedera || '-'}</p>
                      </div>
                    </div>

                    {/* Riwayat Penderita */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Riwayat Penderita</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Keluhan</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.keluhan || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Obat</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.obat || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Makan/Minum</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.makanMinum || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Penyakit</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.penyakit || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Alergi</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.alergi || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Kejadian</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.kejadian || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Penjelasan Tindakan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Penjelasan Tindakan</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p>{selectedForm.data.penjelasanTindakan || '-'}</p>
                      </div>
                    </div>

                    {/* Status Rujukan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Status Rujukan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.statusRujukan}</p>
                        </div>
                        {selectedForm.data.statusRujukan === 'Iya' && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Lokasi Rujukan</span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.data.lokasiRujukan || '-'}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informasi Tambahan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Informasi Tambahan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Dibuat Oleh</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.user?.namaLengkap || 'Petugas'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Spesialisasi</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedForm.user?.spesialisasi || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Tanggal Dibuat</span>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">{formatDate(selectedForm.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Pilih kartu luka dari daftar di sebelah kiri untuk melihat detail</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}