// LaporanSituasiForm.jsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const LaporanSituasiForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    jenisKejadian: '',
    tanggalKejadian: '',
    waktuKejadian: '',
    zonaWaktu: '',
    lokasiTerdampak: '',
    deskripsiKejadian: '',
    statusTanggapDarurat: '',
    tanggalMulaiTanggap: '',
    tanggalAkhirTanggap: '',
    korbanMeninggal: '',
    korbanHilang: '',
    lukaBerat: '',
    lukaRingan: '',
    jumlahPengungsi: '',
    jumlahKKTerdampak: '',
    rumahRusakBerat: '',
    rumahRusakSedang: '',
    rumahRusakRingan: '',
    sekolahRusak: '',
    fasilitasKesehatanRusak: '',
    tempatIbadahRusak: '',
    jembatanRusak: '',
    jalanRusak: '',
    fasilitasPemerintahanRusak: '',
    pelayananKesehatan: '',
    pelayananPsikososial: '',
    paketDapurUmum: '',
    distribusiAirBersih: '',
    hygieneKit: '',
    familyKit: '',
    emergencyShelter: '',
    permintaanRFL: '',
    kebutuhanMendesak: '',
    hambatanLapangan: '',
    aksesibilitasLokasi: '',
    namaPelapor: '',
    posisiPelapor: '',
    kontakPelapor: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Formulir Laporan Situasi Bencana</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-4xl mx-auto bg-background shadow-md rounded-lg">

      {/* Informasi Kejadian */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Informasi Kejadian</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label className="block text-sm font-medium">Jenis Kejadian</Label>
            <Select value={formData.jenisKejadian} onValueChange={(value) => handleInputChange('jenisKejadian', value)}>
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
            <Label className="block text-sm font-medium">Tanggal Kejadian</Label>
            <Input
              type="date"
              value={formData.tanggalKejadian}
              onChange={(e) => handleInputChange('tanggalKejadian', e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Waktu Kejadian</Label>
            <Input
              type="time"
              value={formData.waktuKejadian}
              onChange={(e) => handleInputChange('waktuKejadian', e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Zona Waktu</Label>
            <Select value={formData.zonaWaktu} onValueChange={(value) => handleInputChange('zonaWaktu', value)}>
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
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium">Lokasi Terdampak</Label>
            <Textarea
              value={formData.lokasiTerdampak}
              onChange={(e) => handleInputChange('lokasiTerdampak', e.target.value)}
              rows="2"
              placeholder="Sebutkan provinsi, kabupaten/kota, kecamatan, desa/kelurahan"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium">Deskripsi Singkat Kejadian</Label>
            <Textarea
              value={formData.deskripsiKejadian}
              onChange={(e) => handleInputChange('deskripsiKejadian', e.target.value)}
              rows="3"
              placeholder="Ringkasan kejadian, intensitas, durasi, dll"
            />
          </div>
        </div>
      </fieldset>

      {/* Status Tanggap Darurat */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Status Tanggap Darurat</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <Label className="block text-sm font-medium">Status Saat Ini</Label>
            <Select value={formData.statusTanggapDarurat} onValueChange={(value) => handleInputChange('statusTanggapDarurat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tanggap_darurat">Tanggap Darurat</SelectItem>
                <SelectItem value="transisi_darurat">Transisi Darurat</SelectItem>
                <SelectItem value="pemulihan">Pemulihan</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium">Tanggal Mulai Tanggap Darurat</Label>
            <Input
              type="date"
              value={formData.tanggalMulaiTanggap}
              onChange={(e) => handleInputChange('tanggalMulaiTanggap', e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Tanggal Akhir Tanggap Darurat (jika ada)</Label>
            <Input
              type="date"
              value={formData.tanggalAkhirTanggap}
              onChange={(e) => handleInputChange('tanggalAkhirTanggap', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* Dampak Bencana */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Dampak Bencana</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label className="block text-sm font-medium">Jumlah Korban Meninggal</Label>
            <Input
              type="number"
              min="0"
              value={formData.korbanMeninggal}
              onChange={(e) => handleInputChange('korbanMeninggal', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Jumlah Korban Hilang</Label>
            <Input
              type="number"
              min="0"
              value={formData.korbanHilang}
              onChange={(e) => handleInputChange('korbanHilang', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Luka Berat</Label>
            <Input
              type="number"
              min="0"
              value={formData.lukaBerat}
              onChange={(e) => handleInputChange('lukaBerat', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Luka Ringan</Label>
            <Input
              type="number"
              min="0"
              value={formData.lukaRingan}
              onChange={(e) => handleInputChange('lukaRingan', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Jumlah Pengungsi (jiwa)</Label>
            <Input
              type="number"
              min="0"
              value={formData.jumlahPengungsi}
              onChange={(e) => handleInputChange('jumlahPengungsi', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Jumlah KK Terdampak</Label>
            <Input
              type="number"
              min="0"
              value={formData.jumlahKKTerdampak}
              onChange={(e) => handleInputChange('jumlahKKTerdampak', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </fieldset>

      {/* Kerusakan Infrastruktur */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Kerusakan Infrastruktur</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <Label className="block text-sm font-medium">Rumah Rusak Berat</Label>
            <Input
              type="number"
              min="0"
              value={formData.rumahRusakBerat}
              onChange={(e) => handleInputChange('rumahRusakBerat', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Rumah Rusak Sedang</Label>
            <Input
              type="number"
              min="0"
              value={formData.rumahRusakSedang}
              onChange={(e) => handleInputChange('rumahRusakSedang', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Rumah Rusak Ringan</Label>
            <Input
              type="number"
              min="0"
              value={formData.rumahRusakRingan}
              onChange={(e) => handleInputChange('rumahRusakRingan', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Sekolah Rusak</Label>
            <Input
              type="number"
              min="0"
              value={formData.sekolahRusak}
              onChange={(e) => handleInputChange('sekolahRusak', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Fasilitas Kesehatan Rusak</Label>
            <Input
              type="number"
              min="0"
              value={formData.fasilitasKesehatanRusak}
              onChange={(e) => handleInputChange('fasilitasKesehatanRusak', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Tempat Ibadah Rusak</Label>
            <Input
              type="number"
              min="0"
              value={formData.tempatIbadahRusak}
              onChange={(e) => handleInputChange('tempatIbadahRusak', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Jembatan Rusak</Label>
            <Input
              type="number"
              min="0"
              value={formData.jembatanRusak}
              onChange={(e) => handleInputChange('jembatanRusak', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Jalan Rusak (km)</Label>
            <Input
              type="number"
              min="0"
              value={formData.jalanRusak}
              onChange={(e) => handleInputChange('jalanRusak', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Fasilitas Pemerintahan Rusak</Label>
            <Input
              type="number"
              min="0"
              value={formData.fasilitasPemerintahanRusak}
              onChange={(e) => handleInputChange('fasilitasPemerintahanRusak', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </fieldset>

      {/* Layanan yang Telah Diberikan */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Layanan yang Telah Diberikan</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label className="block text-sm font-medium">Pelayanan Kesehatan (jiwa)</Label>
            <Input
              type="number"
              min="0"
              value={formData.pelayananKesehatan}
              onChange={(e) => handleInputChange('pelayananKesehatan', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Pelayanan Psikososial (jiwa)</Label>
            <Input
              type="number"
              min="0"
              value={formData.pelayananPsikososial}
              onChange={(e) => handleInputChange('pelayananPsikososial', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Paket Dapur Umum</Label>
            <Input
              type="number"
              min="0"
              value={formData.paketDapurUmum}
              onChange={(e) => handleInputChange('paketDapurUmum', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Distribusi Air Bersih (liter)</Label>
            <Input
              type="number"
              min="0"
              value={formData.distribusiAirBersih}
              onChange={(e) => handleInputChange('distribusiAirBersih', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Hygiene Kit Didistribusikan</Label>
            <Input
              type="number"
              min="0"
              value={formData.hygieneKit}
              onChange={(e) => handleInputChange('hygieneKit', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Family Kit Didistribusikan</Label>
            <Input
              type="number"
              min="0"
              value={formData.familyKit}
              onChange={(e) => handleInputChange('familyKit', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Emergency Shelter (KK)</Label>
            <Input
              type="number"
              min="0"
              value={formData.emergencyShelter}
              onChange={(e) => handleInputChange('emergencyShelter', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Permintaan RFL (Restoring Family Links)</Label>
            <Input
              type="number"
              min="0"
              value={formData.permintaanRFL}
              onChange={(e) => handleInputChange('permintaanRFL', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </fieldset>

      {/* Kebutuhan Mendesak */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Kebutuhan Mendesak</legend>
        <Textarea
          value={formData.kebutuhanMendesak}
          onChange={(e) => handleInputChange('kebutuhanMendesak', e.target.value)}
          rows="4"
          placeholder="Sebutkan kebutuhan mendesak: logistik, medis, air, transportasi, SDM, peralatan, dll"
        />
      </fieldset>

      {/* Hambatan di Lapangan */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Hambatan di Lapangan</legend>
        <Textarea
          value={formData.hambatanLapangan}
          onChange={(e) => handleInputChange('hambatanLapangan', e.target.value)}
          rows="4"
          placeholder="Sebutkan hambatan: akses, komunikasi, logistik, dana, SDM, cuaca, keamanan, dll"
        />
      </fieldset>

      {/* Aksesibilitas Lokasi */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Aksesibilitas Lokasi</legend>
        <Textarea
          value={formData.aksesibilitasLokasi}
          onChange={(e) => handleInputChange('aksesibilitasLokasi', e.target.value)}
          rows="3"
          placeholder="Kondisi akses jalan, transportasi, dan kendala mobilitas ke lokasi terdampak"
        />
      </fieldset>

      {/* Kontak Personil */}
      <fieldset className="border border-border p-4 rounded">
        <legend className="font-semibold text-lg text-foreground">Kontak Personil Pelapor</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label className="block text-sm font-medium">Nama Lengkap</Label>
            <Input
              type="text"
              value={formData.namaPelapor}
              onChange={(e) => handleInputChange('namaPelapor', e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium">Posisi/Jabatan</Label>
            <Input
              type="text"
              value={formData.posisiPelapor}
              onChange={(e) => handleInputChange('posisiPelapor', e.target.value)}
              placeholder="Posisi/Jabatan"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium">Nomor Kontak (WA/HP)</Label>
            <Input
              type="tel"
              value={formData.kontakPelapor}
              onChange={(e) => handleInputChange('kontakPelapor', e.target.value)}
              placeholder="Nomor kontak (WA/HP)"
            />
          </div>
        </div>
      </fieldset>

      {/* Tombol Submit */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          Kirim Laporan
        </Button>
      </div>
      </form>
    </>
  );
};

export default LaporanSituasiForm;
