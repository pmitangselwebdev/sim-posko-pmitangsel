const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample users for petugas posko
  const users = await Promise.all([
    prisma.user.create({
      data: {
        namaLengkap: 'Ahmad Rahman',
        ttl: new Date('1990-01-15'),
        jenisKelamin: 'Laki-laki',
        alamat: 'Jl. Sudirman No. 123, Jakarta',
        golonganDarah: 'A+',
        nomorHandphone: '081234567890',
        spesialisasi: 'Petugas Posko',
        asalPMI: 'PMI Jakarta Pusat',
        email: 'ahmad.rahman@pmi.go.id',
        password: '$2a$10$hashedpassword1', // bcrypt hash for 'password123'
        role: 'Petugas',
        subRole: 'posko',
        status: 'siaga'
      }
    }),
    prisma.user.create({
      data: {
        namaLengkap: 'Siti Nurhaliza',
        ttl: new Date('1988-03-22'),
        jenisKelamin: 'Perempuan',
        alamat: 'Jl. Thamrin No. 456, Jakarta',
        golonganDarah: 'O+',
        nomorHandphone: '081234567891',
        spesialisasi: 'Paramedis',
        asalPMI: 'PMI Jakarta Pusat',
        email: 'siti.nurhaliza@pmi.go.id',
        password: '$2a$10$hashedpassword2',
        role: 'Petugas',
        subRole: 'ambulance',
        status: 'siaga'
      }
    }),
    prisma.user.create({
      data: {
        namaLengkap: 'Budi Santoso',
        ttl: new Date('1992-07-10'),
        jenisKelamin: 'Laki-laki',
        alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
        golonganDarah: 'B+',
        nomorHandphone: '081234567892',
        spesialisasi: 'Koordinator Tanggap Darurat',
        asalPMI: 'PMI Jakarta Pusat',
        email: 'budi.santoso@pmi.go.id',
        password: '$2a$10$hashedpassword3',
        role: 'Koordinator',
        subRole: 'tanggap-darurat-bencana',
        status: 'siaga'
      }
    }),
    prisma.user.create({
      data: {
        namaLengkap: 'Dewi Sari',
        ttl: new Date('1985-11-08'),
        jenisKelamin: 'Perempuan',
        alamat: 'Jl. BSD No. 45, Tangerang Selatan',
        golonganDarah: 'AB+',
        nomorHandphone: '081234567893',
        spesialisasi: 'Petugas Posko',
        asalPMI: 'PMI Kota Tangerang Selatan',
        email: 'dewi.sari@pmi.go.id',
        password: '$2a$10$hashedpassword4',
        role: 'Petugas',
        subRole: 'posko',
        status: 'bertugas'
      }
    }),
    prisma.user.create({
      data: {
        namaLengkap: 'Rudi Hartono',
        ttl: new Date('1987-05-20'),
        jenisKelamin: 'Laki-laki',
        alamat: 'Jl. Serpong No. 67, Tangerang Selatan',
        golonganDarah: 'O-',
        nomorHandphone: '081234567894',
        spesialisasi: 'Petugas Posko',
        asalPMI: 'PMI Kota Tangerang Selatan',
        email: 'rudi.hartono@pmi.go.id',
        password: '$2a$10$hashedpassword5',
        role: 'Petugas',
        subRole: 'posko',
        status: 'siaga'
      }
    }),
    prisma.user.create({
      data: {
        namaLengkap: 'Maya Putri',
        ttl: new Date('1991-09-14'),
        jenisKelamin: 'Perempuan',
        alamat: 'Jl. Ciputat No. 89, Tangerang Selatan',
        golonganDarah: 'B-',
        nomorHandphone: '081234567895',
        spesialisasi: 'Koordinator Posko',
        asalPMI: 'PMI Kota Tangerang Selatan',
        email: 'maya.putri@pmi.go.id',
        password: '$2a$10$hashedpassword6',
        role: 'Koordinator',
        subRole: 'posko',
        status: 'siaga'
      }
    })
  ])

  // Create sample vehicles for petugas posko
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        type: 'Ambulance',
        nomorPolisi: 'B 1234 ABC',
        nomorLambung: 'AMB-001',
        posko: 'Posko Pusat Jakarta',
        status: 'available'
      }
    }),
    prisma.vehicle.create({
      data: {
        type: 'Mobil Operasional',
        nomorPolisi: 'B 5678 DEF',
        nomorLambung: 'MOB-001',
        posko: 'Posko Pusat Jakarta',
        status: 'available'
      }
    }),
    prisma.vehicle.create({
      data: {
        type: 'Motor Trail',
        nomorPolisi: 'B 9012 GHI',
        nomorLambung: 'MTR-001',
        posko: 'Posko Pusat Jakarta',
        status: 'available'
      }
    }),
    prisma.vehicle.create({
      data: {
        type: 'Ambulance',
        nomorPolisi: 'B 2468 JKL',
        nomorLambung: 'AMB-002',
        posko: 'Posko Kota Tangerang Selatan',
        status: 'available'
      }
    }),
    prisma.vehicle.create({
      data: {
        type: 'Mobil Operasional',
        nomorPolisi: 'B 1357 MNO',
        nomorLambung: 'MOB-002',
        posko: 'Posko Kota Tangerang Selatan',
        status: 'in-use'
      }
    }),
    prisma.vehicle.create({
      data: {
        type: 'Motor Trail',
        nomorPolisi: 'B 8642 PQR',
        nomorLambung: 'MTR-002',
        posko: 'Posko Kota Tangerang Selatan',
        status: 'available'
      }
    }),
    prisma.vehicle.create({
      data: {
        type: 'Truk Logistik',
        nomorPolisi: 'B 9753 STU',
        nomorLambung: 'TRK-001',
        posko: 'Posko Kota Tangerang Selatan',
        status: 'available'
      }
    })
  ])

  // Create sample incidents for petugas posko
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        type: 'Kecelakaan Lalu Lintas',
        location: 'Jl. Sudirman, Jakarta Pusat',
        date: new Date(),
        description: 'Kecelakaan mobil dengan sepeda motor',
        status: 'active'
      }
    }),
    prisma.incident.create({
      data: {
        type: 'Banjir',
        location: 'Kelurahan Cempaka Putih, Jakarta Pusat',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        description: 'Banjir akibat hujan deras',
        status: 'resolved'
      }
    }),
    prisma.incident.create({
      data: {
        type: 'Gempa Bumi',
        location: 'Kecamatan Serpong, Kota Tangerang Selatan',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        description: 'Gempa bumi berkekuatan 5.2 SR, pusat gempa di laut selatan Banten',
        status: 'active'
      }
    }),
    prisma.incident.create({
      data: {
        type: 'Kebakaran Hutan',
        location: 'Kecamatan Ciputat, Kota Tangerang Selatan',
        date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        description: 'Kebakaran hutan di area perbukitan, api sudah menyebar ke beberapa hektar',
        status: 'active'
      }
    }),
    prisma.incident.create({
      data: {
        type: 'Tanah Longsor',
        location: 'Kelurahan Pondok Aren, Kota Tangerang Selatan',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        description: 'Tanah longsor menutup jalan utama, beberapa rumah terancam',
        status: 'active'
      }
    })
  ])

  // Create sample reports for petugas posko
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        userId: users[0].id,
        type: 'laporan-harian',
        data: {
          type: 'laporan-harian',
          shift: 'Shift 1',
          aktivitas: 'Melakukan patroli rutin di area posko',
          jumlahPanggilan: 5,
          jumlahRujukan: 2,
          catatan: 'Semua berjalan lancar'
        }
      }
    }),
    prisma.report.create({
      data: {
        userId: users[3].id,
        type: 'laporan-harian',
        data: {
          type: 'laporan-harian',
          shift: 'Shift 2',
          aktivitas: 'Monitoring kejadian gempa bumi di Serpong, koordinasi dengan tim SAR',
          jumlahPanggilan: 12,
          jumlahRujukan: 3,
          catatan: 'Situasi terkendali, tim SAR sudah bergerak'
        }
      }
    }),
    prisma.report.create({
      data: {
        userId: users[4].id,
        type: 'laporan-harian',
        data: {
          type: 'laporan-harian',
          shift: 'Shift 1',
          aktivitas: 'Persiapan logistik untuk kejadian tanah longsor di Pondok Aren',
          jumlahPanggilan: 8,
          jumlahRujukan: 1,
          catatan: 'Stok logistik siap didistribusikan'
        }
      }
    }),
    prisma.report.create({
      data: {
        userId: users[0].id,
        type: 'laporan-situasi',
        data: {
          jenisKejadian: 'banjir',
          tanggalKejadian: new Date().toISOString().split('T')[0],
          waktuKejadian: '14:30',
          zonaWaktu: 'WIB',
          lokasiTerdampak: 'Jakarta Pusat, Kelurahan Cempaka Putih',
          deskripsiKejadian: 'Banjir setinggi 1 meter akibat hujan deras selama 3 jam',
          statusTanggapDarurat: 'tanggap_darurat',
          tanggalMulaiTanggap: new Date().toISOString().split('T')[0],
          tanggalAkhirTanggap: null,
          korbanMeninggal: 0,
          korbanHilang: 0,
          lukaBerat: 2,
          lukaRingan: 5,
          jumlahPengungsi: 150,
          jumlahKKTerdampak: 45,
          rumahRusakBerat: 0,
          rumahRusakSedang: 3,
          rumahRusakRingan: 12,
          sekolahRusak: 0,
          fasilitasKesehatanRusak: 0,
          tempatIbadahRusak: 0,
          jembatanRusak: 0,
          jalanRusak: 2,
          fasilitasPemerintahanRusak: 0,
          pelayananKesehatan: 25,
          pelayananPsikososial: 10,
          paketDapurUmum: 50,
          distribusiAirBersih: 200,
          hygieneKit: 30,
          familyKit: 15,
          emergencyShelter: 3,
          permintaanRFL: 5,
          kebutuhanMendesak: 'Perlu tambahan paket dapur umum dan air bersih',
          hambatanLapangan: 'Akses jalan terbatas karena banjir',
          aksesibilitasLokasi: 'Menggunakan perahu karet untuk distribusi bantuan',
          namaPelapor: 'Ahmad Rahman',
          posisiPelapor: 'Petugas Posko',
          kontakPelapor: '081234567890'
        }
      }
    }),
    prisma.report.create({
      data: {
        userId: users[3].id,
        type: 'laporan-situasi',
        data: {
          jenisKejadian: 'gempa-bumi',
          tanggalKejadian: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0],
          waktuKejadian: '16:45',
          zonaWaktu: 'WIB',
          lokasiTerdampak: 'Kecamatan Serpong, Kota Tangerang Selatan',
          deskripsiKejadian: 'Gempa bumi berkekuatan 5.2 SR dengan pusat gempa di laut selatan Banten',
          statusTanggapDarurat: 'tanggap_darurat',
          tanggalMulaiTanggap: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0],
          tanggalAkhirTanggap: null,
          korbanMeninggal: 1,
          korbanHilang: 2,
          lukaBerat: 8,
          lukaRingan: 15,
          jumlahPengungsi: 320,
          jumlahKKTerdampak: 120,
          rumahRusakBerat: 5,
          rumahRusakSedang: 12,
          rumahRusakRingan: 25,
          sekolahRusak: 1,
          fasilitasKesehatanRusak: 0,
          tempatIbadahRusak: 1,
          jembatanRusak: 0,
          jalanRusak: 3,
          fasilitasPemerintahanRusak: 0,
          pelayananKesehatan: 45,
          pelayananPsikososial: 20,
          paketDapurUmum: 80,
          distribusiAirBersih: 150,
          hygieneKit: 50,
          familyKit: 25,
          emergencyShelter: 8,
          permintaanRFL: 12,
          kebutuhanMendesak: 'Perlu lebih banyak tenda darurat dan obat-obatan',
          hambatanLapangan: 'Beberapa jalan rusak akibat gempa',
          aksesibilitasLokasi: 'Menggunakan jalur darat dan udara untuk distribusi',
          namaPelapor: 'Dewi Sari',
          posisiPelapor: 'Petugas Posko',
          kontakPelapor: '081234567893'
        }
      }
    })
  ])

  // Create sample blood stock
  const bloodStocks = await Promise.all([
    prisma.bloodStock.create({
      data: {
        type: 'A+',
        quantity: 25
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'A-',
        quantity: 15
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'B+',
        quantity: 20
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'B-',
        quantity: 10
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'O+',
        quantity: 30
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'O-',
        quantity: 8
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'AB+',
        quantity: 12
      }
    }),
    prisma.bloodStock.create({
      data: {
        type: 'AB-',
        quantity: 5
      }
    })
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${users.length} users`)
  console.log(`Created ${vehicles.length} vehicles`)
  console.log(`Created ${incidents.length} incidents`)
  console.log(`Created ${reports.length} reports`)
  console.log(`Created ${bloodStocks.length} blood stock entries`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
