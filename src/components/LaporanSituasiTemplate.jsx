// LaporanSituasiTemplate.jsx
import React from 'react';

const LaporanSituasiTemplate = ({ data }) => {
  // Map form data to template fields
  const templateData = {
    nomorLaporan: '01', // Could be auto-generated
    jenisKejadian: data?.jenisKejadian || '',
    lokasi: data?.lokasiTerdampak || '',
    waktuKejadian: data?.tanggalKejadian ? `${data.tanggalKejadian} ${data.waktuKejadian || ''} ${data.zonaWaktu || ''}` : '',
    waktuUpdate: '13/10/2025, 22:46:52',
    dukunganInternasional: 'TIDAK', // Default, could be configurable
    gambaranUmum: data?.deskripsiKejadian || '',
    korbanMeninggal: data?.korbanMeninggal || '',
    korbanHilang: data?.korbanHilang || '',
    lukaBerat: data?.lukaBerat || '',
    lukaRingan: data?.lukaRingan || '',
    pengungsiJiwa: data?.jumlahPengungsi || '',
    kkTerdampak: data?.jumlahKKTerdampak || '',
    rumahRb: data?.rumahRusakBerat || '',
    rumahRs: data?.rumahRusakSedang || '',
    rumahRr: data?.rumahRusakRingan || '',
    sekolahRusak: data?.sekolahRusak || '',
    faskesRusak: data?.fasilitasKesehatanRusak || '',
    ibadahRusak: data?.tempatIbadahRusak || '',
    layananKesehatan: data?.pelayananKesehatan || '',
    layananPsp: data?.pelayananPsikososial || '',
    dapurUmum: data?.paketDapurUmum || '',
    airBersih: data?.distribusiAirBersih || '',
    hygieneKit: data?.hygieneKit || '',
    familyKit: data?.familyKit || '',
    emergencyShelter: data?.emergencyShelter || '',
    rfl: data?.permintaanRFL || '',
    kebutuhan: data?.kebutuhanMendesak || '',
    hambatan: data?.hambatanLapangan || '',
    akses: data?.aksesibilitasLokasi || '',
    kontak1: {
      nama: data?.namaPelapor || '',
      posisi: data?.posisiPelapor || '',
      kontak: data?.kontakPelapor || ''
    },
    kontak2: {
      nama: '',
      posisi: '',
      kontak: ''
    }
  };

  return (
    <div
      id="laporan-situasi-pdf"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '15mm',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.4,
        color: '#000',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '0' }}>LAPORAN SITUASI {templateData.nomorLaporan}</h2>
        <div style={{ marginTop: '4px' }}>
          <strong>Kejadian Bencana:</strong> {templateData.jenisKejadian || '________________________'}<br />
          <strong>Lokasi:</strong> {templateData.lokasi || '________________________'}<br />
          <strong>Waktu Kejadian:</strong> {templateData.waktuKejadian || '________________________'}<br />
          <strong>Update:</strong> {templateData.waktuUpdate}
        </div>
        <div style={{ marginTop: '6px' }}>
          <strong>Pemerintah membutuhkan dukungan internasional:</strong> {templateData.dukunganInternasional}
        </div>
      </div>

      <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #000' }} />

      {/* Gambaran Umum Situasi */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '10px' }}>Gambaran Umum Situasi</h3>
      <p style={{ whiteSpace: 'pre-wrap', minHeight: '60px' }}>
        {templateData.gambaranUmum || '________________________________________________________________________________\n________________________________________________________________________________'}
      </p>

      {/* Dampak Bencana */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Dampak Bencana</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', padding: '4px 0' }}>Korban Meninggal</td>
            <td style={{ width: '50%', padding: '4px 0' }}>: {templateData.korbanMeninggal || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Korban Hilang</td>
            <td style={{ padding: '4px 0' }}>: {templateData.korbanHilang || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Luka Berat</td>
            <td style={{ padding: '4px 0' }}>: {templateData.lukaBerat || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Luka Ringan</td>
            <td style={{ padding: '4px 0' }}>: {templateData.lukaRingan || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Jumlah Pengungsi (Jiwa)</td>
            <td style={{ padding: '4px 0' }}>: {templateData.pengungsiJiwa || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Jumlah KK Terdampak</td>
            <td style={{ padding: '4px 0' }}>: {templateData.kkTerdampak || '________'}</td>
          </tr>
        </tbody>
      </table>

      {/* Kerusakan Infrastruktur */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Kerusakan Infrastruktur</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
        <tbody>
          <tr>
            <td style={{ width: '60%', padding: '4px 0' }}>Rumah Rusak Berat</td>
            <td style={{ width: '40%', padding: '4px 0' }}>: {templateData.rumahRb || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Rumah Rusak Sedang</td>
            <td style={{ padding: '4px 0' }}>: {templateData.rumahRs || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Rumah Rusak Ringan</td>
            <td style={{ padding: '4px 0' }}>: {templateData.rumahRr || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Sekolah Rusak</td>
            <td style={{ padding: '4px 0' }}>: {templateData.sekolahRusak || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Fasilitas Kesehatan Rusak</td>
            <td style={{ padding: '4px 0' }}>: {templateData.faskesRusak || '________'}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Tempat Ibadah Rusak</td>
            <td style={{ padding: '4px 0' }}>: {templateData.ibadahRusak || '________'}</td>
          </tr>
        </tbody>
      </table>

      {/* Layanan PMI */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Layanan PMI</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
        <tbody>
          <tr>
            <td style={{ width: '70%', padding: '4px 0' }}>Pelayanan Kesehatan</td>
            <td style={{ width: '30%', padding: '4px 0' }}>: {templateData.layananKesehatan || '________'} jiwa</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Pelayanan Psikososial (PSP)</td>
            <td style={{ padding: '4px 0' }}>: {templateData.layananPsp || '________'} jiwa</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Dapur Umum</td>
            <td style={{ padding: '4px 0' }}>: {templateData.dapurUmum || '________'} paket</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Distribusi Air Bersih</td>
            <td style={{ padding: '4px 0' }}>: {templateData.airBersih || '________'} liter</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Hygiene Kit</td>
            <td style={{ padding: '4px 0' }}>: {templateData.hygieneKit || '________'} unit</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Family Kit</td>
            <td style={{ padding: '4px 0' }}>: {templateData.familyKit || '________'} unit</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Emergency Shelter</td>
            <td style={{ padding: '4px 0' }}>: {templateData.emergencyShelter || '________'} KK</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Pelayanan RFL</td>
            <td style={{ padding: '4px 0' }}>: {templateData.rfl || '________'} permintaan</td>
          </tr>
        </tbody>
      </table>

      {/* Kebutuhan Mendesak */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Kebutuhan Mendesak</h3>
      <p style={{ minHeight: '40px', whiteSpace: 'pre-wrap' }}>
        {templateData.kebutuhan || '________________________________________________________________________________'}
      </p>

      {/* Hambatan di Lapangan */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Hambatan di Lapangan</h3>
      <p style={{ minHeight: '40px', whiteSpace: 'pre-wrap' }}>
        {templateData.hambatan || '________________________________________________________________________________'}
      </p>

      {/* Aksesibilitas Lokasi */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Aksesibilitas Lokasi</h3>
      <p style={{ minHeight: '30px', whiteSpace: 'pre-wrap' }}>
        {templateData.akses || '________________________________________________________________________________'}
      </p>

      {/* Kontak Personil */}
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '14px' }}>Personil yang Dapat Dihubungi</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Nama Lengkap</th>
            <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Posisi</th>
            <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Kontak</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{templateData.kontak1.nama || '________________'}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{templateData.kontak1.posisi || '________________'}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{templateData.kontak1.kontak || '________________'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{templateData.kontak2.nama || '________________'}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{templateData.kontak2.posisi || '________________'}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{templateData.kontak2.kontak || '________________'}</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '9pt', color: '#555' }}>
        <em>Dokumen ini dibuat oleh Palang Merah Indonesia – 13/10/2025</em>
      </div>
    </div>
  );
};

export default LaporanSituasiTemplate;
