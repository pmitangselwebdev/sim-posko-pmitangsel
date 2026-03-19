import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generateDummyData() {
  try {
    console.log('Generating dummy ambulance report data...')

    // Get existing users
    const users = await prisma.user.findMany({
      where: {
        role: 'Petugas',
        subRole: 'ambulance'
      }
    })

    if (users.length === 0) {
      console.log('No ambulance users found. Creating some users first...')
      
      // Create ambulance users
      const ambulanceUsers = await prisma.user.createMany({
        data: [
          {
            namaLengkap: 'Dr. Ahmad Fauzi',
            ttl: new Date('1985-03-15'),
            jenisKelamin: 'Laki-laki',
            alamat: 'Jl. Sudirman No. 123, Tangerang Selatan',
            golonganDarah: 'A+',
            nomorHandphone: '081234567890',
            spesialisasi: 'Dokter Ambulans',
            asalPMI: 'PMI Kota Tangerang Selatan',
            email: 'ahmad.fauzi@pmi-tangsel.org',
            password: 'password123',
            role: 'Petugas',
            subRole: 'ambulance',
            status: 'siaga',
            isApproved: true
          },
          {
            namaLengkap: 'Siti Nurhaliza',
            ttl: new Date('1990-07-22'),
            jenisKelamin: 'Perempuan',
            alamat: 'Jl. Pajajaran No. 456, Tangerang Selatan',
            golonganDarah: 'B-',
            nomorHandphone: '081234567891',
            spesialisasi: 'Perawat Ambulans',
            asalPMI: 'PMI Kota Tangerang Selatan',
            email: 'siti.nurhaliza@pmi-tangsel.org',
            password: 'password123',
            role: 'Petugas',
            subRole: 'ambulance',
            status: 'siaga',
            isApproved: true
          },
          {
            namaLengkap: 'Budi Santoso',
            ttl: new Date('1988-11-08'),
            jenisKelamin: 'Laki-laki',
            alamat: 'Jl. Gatot Subroto No. 789, Tangerang Selatan',
            golonganDarah: 'O+',
            nomorHandphone: '081234567892',
            spesialisasi: 'Sopir Ambulans',
            asalPMI: 'PMI Kota Tangerang Selatan',
            email: 'budi.santoso@pmi-tangsel.org',
            password: 'password123',
            role: 'Petugas',
            subRole: 'ambulance',
            status: 'siaga',
            isApproved: true
          }
        ]
      })
      
      console.log(`Created ${ambulanceUsers.count} ambulance users`)
    }

    // Get existing incidents or create some
    let incidents = await prisma.incident.findMany()
    
    if (incidents.length === 0) {
      console.log('No incidents found. Creating some incidents...')
      
      incidents = await prisma.incident.createMany({
        data: [
          {
            type: 'Kecelakaan Lalu Lintas',
            location: 'Jl. Raya Serpong, Tangerang Selatan',
            date: new Date('2025-12-15T14:30:00Z'),
            description: 'Kecelakaan motor vs mobil di perempatan lampu merah',
            status: 'completed'
          },
          {
            type: 'Serangan Jantung',
            location: 'Rumah Sakit Premier Bintaro, Tangerang Selatan',
            date: new Date('2025-12-16T09:15:00Z'),
            description: 'Pasien pria 55 tahun mengalami nyeri dada mendadak',
            status: 'completed'
          },
          {
            type: 'Kecelakaan Kerja',
            location: 'Pabrik Elektronik Ciputat, Tangerang Selatan',
            date: new Date('2025-12-17T16:45:00Z'),
            description: 'Pekerja terjatuh dari ketinggian 3 meter',
            status: 'completed'
          },
          {
            type: 'Kecelakaan Sepeda Motor',
            location: 'Jl. Pahlawan Seribu, BSD City',
            date: new Date('2025-12-18T20:20:00Z'),
            description: 'Tabrakan beruntun 3 kendaraan sepeda motor',
            status: 'completed'
          },
          {
            type: 'Stroke',
            location: 'Perumahan Bintaro Jaya, Tangerang Selatan',
            date: new Date('2025-12-19T07:45:00Z'),
            description: 'Pasien wanita 62 tahun mengalami kelumpuhan separuh tubuh',
            status: 'completed'
          }
        ]
      })
      
      incidents = await prisma.incident.findMany()
      console.log(`Created ${incidents.length} incidents`)
    }

    // Get updated users list
    const ambulanceUsers = await prisma.user.findMany({
      where: {
        role: 'Petugas',
        subRole: 'ambulance'
      }
    })

    // Generate ambulance forms
    const ambulanceForms = []
    const formTypes = ['Laporan Situasi', 'Laporan Kegiatan', 'Laporan Kondisi Kendaraan']
    
    for (let i = 0; i < 10; i++) {
      const randomUser = ambulanceUsers[Math.floor(Math.random() * ambulanceUsers.length)]
      const randomIncident = incidents[Math.floor(Math.random() * incidents.length)]
      const randomFormType = formTypes[Math.floor(Math.random() * formTypes.length)]
      
      const form = {
        userId: randomUser.id,
        incidentId: randomIncident.id,
        data: {
          // Form fields for Kartu Luka
          jenisKejadian: Math.random() > 0.5 ? 'Rujukan' : 'Kecelakaan',
          waktuKejadian: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          lokasi: `Jl. ${['Sudirman', 'Thamrin', 'Gatot Subroto', 'Pajajaran'][Math.floor(Math.random() * 4)]}, Tangerang Selatan`,
          namaPetugas: randomUser.namaLengkap,
          namaKorban: `Korban ${i + 1}`,
          usia: String(Math.floor(Math.random() * 60) + 18),
          jenisKelamin: Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan',
          alamat: `Alamat korban ${i + 1}`,
          nomorTelepon: `081234567${String(i + 1).padStart(3, '0')}`,
          respon: ['Awas', 'Suara', 'Nyeri', 'Tidak Respon'][Math.floor(Math.random() * 4)],
          nafas: ['Kuat', 'Lemah', 'Tidak ada'][Math.floor(Math.random() * 3)],
          frekuensiNafas: String(Math.floor(Math.random() * 30) + 10),
          nadi: ['Kuat', 'Lemah', 'Tidak ada'][Math.floor(Math.random() * 3)],
          frekuensiNadi: String(Math.floor(Math.random() * 100) + 60),
          tekananDarah: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 30) + 60}`,
          jenisCedera: `Cedera ${i + 1}: ${Math.random() > 0.5 ? 'Luka terbuka' : 'Patah tulang'}`,
          keluhan: `Keluhan pasien ${i + 1}`,
          obat: `Obat ${i + 1}`,
          makanMinum: `Makan/minum ${i + 1}`,
          penyakit: `Penyakit ${i + 1}`,
          alergi: `Alergi ${i + 1}`,
          kejadian: `Kejadian ${i + 1}`,
          penjelasanTindakan: `Tindakan medis yang dilakukan: ${Math.random() > 0.5 ? 'Pemberian oksigen' : 'Pemasangan infus'}`,
          statusRujukan: Math.random() > 0.5 ? 'Iya' : 'Tidak',
          lokasiRujukan: Math.random() > 0.5 ? 'RS Premier Bintaro' : undefined,
        }
      }
      
      ambulanceForms.push(form)
    }

    // Create ambulance forms
    for (const form of ambulanceForms) {
      await prisma.ambulanceForm.create({
        data: form
      })
    }

    console.log(`Successfully created ${ambulanceForms.length} ambulance report records`)
    
  } catch (error) {
    console.error('Error generating dummy data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateDummyData()