"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks/use-mounted"
import { useUsers, useDeleteUser, useUpdateUser, useCreateUser } from "@/hooks/use-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { generateSchedulePDF, downloadPDF } from "@/lib/pdfGenerator"
import { useUser } from "@clerk/nextjs"

export default function ManajemenSDM() {
  const { toast } = useToast()
  const mounted = useMounted()
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const [userData, setUserData] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [activeTab, setActiveTab] = useState("personnel")
  const [trainings, setTrainings] = useState([])
  const [schedules, setSchedules] = useState([])
  const [showNewUser, setShowNewUser] = useState(false)
  const [showNewTraining, setShowNewTraining] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // React Query hooks for users data and mutations
  const { data: allUsers = [], isLoading: usersLoading } = useUsers({ approved: null }) // Fetch all users
  const createUserMutation = useCreateUser()
  const deleteUserMutation = useDeleteUser()
  const updateUserMutation = useUpdateUser()

  // Separate approved and unapproved users
  const users = allUsers.filter(user => user.isApproved)
  const unapprovedUsers = allUsers.filter(user => !user.isApproved)

  // Debug logging
  console.log('All users:', allUsers.length)
  console.log('Approved users:', users.length)
  console.log('Unapproved users:', unapprovedUsers.length)
  console.log('Unapproved users data:', unapprovedUsers)

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth < 0) {
      newMonth = 11
      newYear = currentYear - 1
    } else if (newMonth > 11) {
      newMonth = 0
      newYear = currentYear + 1
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const [newUser, setNewUser] = useState({
    namaLengkap: "",
    email: "",
    nomorHandphone: "",
    spesialisasi: "",
    role: "Petugas",
    subRole: "",
    status: "siaga"
  })

  const [newTraining, setNewTraining] = useState({
    userId: "",
    nama: "",
    jenis: "",
    tanggal: "",
    sertifikat: ""
  })

  const [newSchedule, setNewSchedule] = useState({
    userId: "",
    tanggal: "",
    shift: "",
    posko: ""
  })

  // Check user role access
  useEffect(() => {
    const checkAccess = async () => {
      if (clerkUser?.emailAddresses[0]?.emailAddress) {
        try {
          const response = await fetch(`/api/users/profile?email=${clerkUser.emailAddresses[0].emailAddress}`)
          if (response.ok) {
            const userData = await response.json()
            const userRole = userData.role
            const hasAccess = userRole === 'Admin' || userRole === 'Koordinator'

            setUserData(userData)
            setHasAccess(hasAccess)

            if (!hasAccess) {
              // Redirect to dashboard if user doesn't have access
              router.push('/dashboard')
              toast({
                title: "Akses Ditolak",
                description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
                variant: "destructive",
                duration: 5000,
              })
            }
          }
        } catch (error) {
          console.error('Error checking user access:', error)
          router.push('/dashboard')
        }
      }
    }

    if (clerkUser) {
      checkAccess()
    }
  }, [clerkUser, router, toast])

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      fetchData()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const fetchData = async () => {
    try {
      const [trainingsRes, schedulesRes] = await Promise.all([
        fetch('/api/trainings'),
        fetch('/api/schedules')
      ])

      if (trainingsRes.ok) setTrainings(await trainingsRes.json())
      if (schedulesRes.ok) setSchedules(await schedulesRes.json())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      await createUserMutation.mutateAsync(newUser)
      toast({
        title: "Berhasil!",
        description: "Pengguna berhasil dibuat!",
        duration: 3000,
      })
      setShowNewUser(false)
      setNewUser({
        namaLengkap: "",
        email: "",
        nomorHandphone: "",
        spesialisasi: "",
        role: "Petugas",
        subRole: "",
        status: "siaga"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat pengguna",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleCreateTraining = async () => {
    try {
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTraining)
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Pelatihan berhasil ditambahkan!",
          duration: 3000,
        })
        setShowNewTraining(false)
        setNewTraining({
          userId: "",
          nama: "",
          jenis: "",
          tanggal: "",
          sertifikat: ""
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: "Gagal menambahkan pelatihan",
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

  const handleCreateSchedule = async () => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule)
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Jadwal berhasil dibuat!",
          duration: 3000,
        })
        setShowScheduleDialog(false)
        setNewSchedule({
          userId: "",
          tanggal: "",
          shift: "",
          posko: ""
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: "Gagal membuat jadwal",
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "siaga":
        return <Badge variant="default">Siaga</Badge>
      case "cuti":
        return <Badge variant="secondary">Cuti</Badge>
      case "bertugas":
        return <Badge variant="destructive">Bertugas</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role, subRole) => {
    if (role === "Admin") return <Badge variant="destructive">Admin</Badge>
    if (role === "Koordinator") return <Badge variant="secondary">Koordinator</Badge>

    switch (subRole) {
      case "posko":
        return <Badge variant="default">Petugas Posko</Badge>
      case "ambulance":
        return <Badge variant="outline">Crew Ambulance</Badge>
      case "tanggap-darurat-bencana":
        return <Badge variant="destructive">Tanggap Darurat</Badge>
      default:
        return <Badge variant="outline">Petugas</Badge>
    }
  }

  const handleApproveUser = async (userId) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: userId,
        data: { isApproved: true }
      })
      toast({
        title: "Berhasil!",
        description: "Akun berhasil disetujui!",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyetujui akun",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleRejectUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Akun berhasil ditolak dan dihapus!",
          duration: 3000,
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: "Gagal menolak akun",
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

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowEditUserDialog(true)
  }

  const handleUpdateUser = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userId: editingUser.id,
        data: editingUser
      })
      toast({
        title: "Berhasil!",
        description: "Data personel berhasil diperbarui!",
        duration: 3000,
      })
      setShowEditUserDialog(false)
      setEditingUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui data personel",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleDeleteUser = (userId) => {
    // Find the user to delete for the confirmation dialog
    const userToDelete = users.find(user => user.id === userId)
    setDeletingUser(userToDelete)
    setShowDeleteConfirmDialog(true)
  }

  const confirmDeleteUser = async () => {
    if (!deletingUser) return

    try {
      await deleteUserMutation.mutateAsync(deletingUser.id)
      toast({
        title: "Berhasil!",
        description: "Personel berhasil dihapus secara permanen!",
        duration: 3000,
      })
      setShowDeleteConfirmDialog(false)
      setDeletingUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus personel",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const personnelStats = {
    total: users.length,
    siaga: users.filter(u => u.status === 'siaga').length,
    bertugas: users.filter(u => u.status === 'bertugas').length,
    cuti: users.filter(u => u.status === 'cuti').length,
    presentToday: 0, // Will be calculated from attendance data
    activeToday: 0, // Will be calculated from attendance data
    lakiLaki: users.filter(u => u.jenisKelamin === 'Laki-laki').length,
    perempuan: users.filter(u => u.jenisKelamin === 'Perempuan').length,
    spesialisasiStats: {},
    asalPMIStats: {}
  }

  // Calculate specialization stats
  users.forEach(user => {
    personnelStats.spesialisasiStats[user.spesialisasi] = (personnelStats.spesialisasiStats[user.spesialisasi] || 0) + 1
  })

  // Calculate PMI origin stats
  users.forEach(user => {
    personnelStats.asalPMIStats[user.asalPMI] = (personnelStats.asalPMIStats[user.asalPMI] || 0) + 1
  })

  // Only render components after hydration to prevent classList errors
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manajemen SDM & Relawan</h1>
          <div className="flex gap-2">
            <Button disabled>
              Tambah Personel
            </Button>
            <Button variant="outline" disabled>
              Tambah Pelatihan
            </Button>
            <Button variant="outline" disabled>
              Buat Jadwal
            </Button>
          </div>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  // Show loading while checking access
  if (hasAccess === false) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <p className="text-sm text-gray-500 mt-2">Hanya Admin dan Koordinator yang dapat mengakses Manajemen SDM.</p>
        </div>
      </div>
    )
  }

  // Show loading while checking access
  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa izin akses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen SDM & Relawan</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewUser(true)}>
            Tambah Personel
          </Button>
          <Button variant="outline" onClick={() => setShowNewTraining(true)}>
            Tambah Pelatihan
          </Button>
          <Button variant="outline" onClick={() => setShowScheduleDialog(true)}>
            Buat Jadwal
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personnel">Daftar Personel</TabsTrigger>
          <TabsTrigger value="approvals">Persetujuan Akun</TabsTrigger>
          <TabsTrigger value="training">Pelatihan & Sertifikasi</TabsTrigger>
          <TabsTrigger value="schedule">Jadwal Piket</TabsTrigger>
          <TabsTrigger value="stats">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Personel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personnelStats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Siaga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{personnelStats.siaga}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bertugas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{personnelStats.bertugas}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cuti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{personnelStats.cuti}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Personel & Relawan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead>Asal PMI</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status Penugasan</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.foto} />
                          <AvatarFallback>{user.namaLengkap.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.namaLengkap}</TableCell>
                      <TableCell>{user.jenisKelamin}</TableCell>
                      <TableCell>{user.spesialisasi}</TableCell>
                      <TableCell>{user.asalPMI}</TableCell>
                      <TableCell>{getRoleBadge(user.role, user.subRole)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm">{user.nomorHandphone}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pelatihan & Sertifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Personel</TableHead>
                    <TableHead>Nama Pelatihan</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>{training.user.namaLengkap}</TableCell>
                      <TableCell>{training.nama}</TableCell>
                      <TableCell>{training.jenis}</TableCell>
                      <TableCell>{new Date(training.tanggal).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>
                        <Badge variant={training.status === 'aktif' ? 'default' : 'secondary'}>
                          {training.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Piket Bulanan</CardTitle>
              <p className="text-sm text-muted-foreground">
                Klik pada tanggal untuk melihat detail jadwal atau menambah jadwal baru
              </p>
            </CardHeader>
            <CardContent>
              {(() => {
                // Get first day of month and last day of month
                const firstDay = new Date(currentYear, currentMonth, 1)
                const lastDay = new Date(currentYear, currentMonth + 1, 0)
                const startDate = new Date(firstDay)
                startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday

                const endDate = new Date(lastDay)
                endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())) // End on Saturday

                // Create calendar days
                const calendarDays = []
                const current = new Date(startDate)

                while (current <= endDate) {
                  calendarDays.push(new Date(current))
                  current.setDate(current.getDate() + 1)
                }

                // Group schedules by date
                const schedulesByDate = schedules.reduce((acc, schedule) => {
                  const dateKey = new Date(schedule.tanggal).toDateString()
                  if (!acc[dateKey]) acc[dateKey] = []
                  acc[dateKey].push(schedule)
                  return acc
                }, {})

                return (
                  <div className="space-y-4">
                    {/* Month/Year header */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {new Date(currentYear, currentMonth).toLocaleDateString('id-ID', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const pdf = await generateSchedulePDF(schedules, currentMonth, currentYear)
                              const monthName = new Date(currentYear, currentMonth).toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric'
                              }).replace(' ', '-')
                              downloadPDF(pdf, `jadwal-piket-${monthName}.pdf`)

                              toast({
                                title: "Berhasil!",
                                description: "PDF jadwal piket berhasil dibuat dan diunduh.",
                                duration: 3000,
                              })
                            } catch (error) {
                              console.error('PDF generation error:', error)
                              toast({
                                title: "Error",
                                description: "Gagal membuat PDF jadwal piket.",
                                variant: "destructive",
                                duration: 3000,
                              })
                            }
                          }}
                        >
                          📄 Export PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateMonth(-1)}
                        >
                          ‹
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateMonth(1)}
                        >
                          ›
                        </Button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Day headers */}
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                        <div key={day} className="p-2 text-center font-medium text-sm bg-gray-100 dark:bg-gray-800 rounded">
                          {day}
                        </div>
                      ))}

                      {/* Calendar days */}
                      {calendarDays.map((day, index) => {
                        const dateKey = day.toDateString()
                        const daySchedules = schedulesByDate[dateKey] || []
                        const isCurrentMonth = day.getMonth() === currentMonth
                        const isToday = day.toDateString() === new Date().toDateString()

                        return (
                          <div
                            key={index}
                            className={`
                              min-h-[100px] p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                              ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900 text-gray-400' : ''}
                              ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''}
                            `}
                            onClick={() => {
                              // For now, just open the schedule dialog with the selected date
                              setNewSchedule({
                                ...newSchedule,
                                tanggal: day.toISOString().split('T')[0]
                              })
                              setShowScheduleDialog(true)
                            }}
                          >
                            <div className="text-sm font-medium mb-1">
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {daySchedules.slice(0, 2).map((schedule, idx) => (
                                <div
                                  key={schedule.id}
                                  className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 rounded truncate"
                                  title={`${schedule.user.namaLengkap} - ${schedule.shift}`}
                                >
                                  {schedule.user.namaLengkap.split(' ')[0]}
                                </div>
                              ))}
                              {daySchedules.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{daySchedules.length - 2} lainnya
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                        <span>Jadwal Terjadwal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded"></div>
                        <span>Hari Ini</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-50 dark:bg-gray-900 rounded"></div>
                        <span>Bulan Lain</span>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Persetujuan Akun Relawan</CardTitle>
              <p className="text-sm text-gray-600">
                Kelola persetujuan akun relawan yang telah mendaftar
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unapprovedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.namaLengkap}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.spesialisasi}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Menunggu Persetujuan</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectUser(user.id)}
                          >
                            Tolak
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {unapprovedUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada akun yang menunggu persetujuan
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Admin</span>
                    <Badge variant="destructive">{users.filter(u => u.role === 'Admin').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Koordinator</span>
                    <Badge variant="secondary">{users.filter(u => u.role === 'Koordinator').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Petugas Posko</span>
                    <Badge variant="default">{users.filter(u => u.subRole === 'posko').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Crew Ambulance</span>
                    <Badge variant="outline">{users.filter(u => u.subRole === 'ambulance').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tanggap Darurat</span>
                    <Badge variant="destructive">{users.filter(u => u.subRole === 'tanggap-darurat-bencana').length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Ketersediaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Siaga</span>
                    <Badge variant="default">{personnelStats.siaga}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bertugas</span>
                    <Badge variant="destructive">{personnelStats.bertugas}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cuti</span>
                    <Badge variant="secondary">{personnelStats.cuti}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribusi Jenis Kelamin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Laki-laki</span>
                    <Badge variant="default">{personnelStats.lakiLaki}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Perempuan</span>
                    <Badge variant="secondary">{personnelStats.perempuan}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spesialisasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(personnelStats.spesialisasiStats).map(([spesialisasi, count]) => (
                    <div key={spesialisasi} className="flex justify-between items-center">
                      <span className="text-sm">{spesialisasi}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Asal PMI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(personnelStats.asalPMIStats).map(([asalPMI, count]) => (
                  <div key={asalPMI} className="flex justify-between items-center">
                    <span className="text-sm">{asalPMI}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New User Dialog */}
      <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Personel Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nama Lengkap</Label>
                <Input
                  placeholder="Masukkan nama lengkap"
                  value={newUser.namaLengkap}
                  onChange={(e) => setNewUser({...newUser, namaLengkap: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@domain.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nomor Handphone</Label>
                <Input
                  placeholder="081234567890"
                  value={newUser.nomorHandphone}
                  onChange={(e) => setNewUser({...newUser, nomorHandphone: e.target.value})}
                />
              </div>
              <div>
                <Label>Spesialisasi</Label>
                <Select value={newUser.spesialisasi} onValueChange={(value) => setNewUser({...newUser, spesialisasi: value})}>
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petugas">Petugas</SelectItem>
                    <SelectItem value="Koordinator">Koordinator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sub Role</Label>
                <Select value={newUser.subRole} onValueChange={(value) => setNewUser({...newUser, subRole: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sub role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="posko">Posko</SelectItem>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="tanggap-darurat-bencana">Tanggap Darurat Bencana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siaga">Siaga</SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                    <SelectItem value="bertugas">Bertugas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewUser(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateUser}>
                Tambah Personel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Training Dialog */}
      <Dialog open={showNewTraining} onOpenChange={setShowNewTraining}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Pelatihan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pilih Personel</Label>
                <Select value={newTraining.userId} onValueChange={(value) => setNewTraining({...newTraining, userId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih personel" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.namaLengkap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jenis Pelatihan</Label>
                <Select value={newTraining.jenis} onValueChange={(value) => setNewTraining({...newTraining, jenis: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pertolongan Pertama">Pertolongan Pertama</SelectItem>
                    <SelectItem value="Penanganan Trauma">Penanganan Trauma</SelectItem>
                    <SelectItem value="Driving Ambulance">Driving Ambulance</SelectItem>
                    <SelectItem value="Koordinasi Darurat">Koordinasi Darurat</SelectItem>
                    <SelectItem value="Manajemen Logistik">Manajemen Logistik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Nama Pelatihan</Label>
              <Input
                placeholder="Masukkan nama pelatihan"
                value={newTraining.nama}
                onChange={(e) => setNewTraining({...newTraining, nama: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tanggal Pelatihan</Label>
                <Input
                  type="date"
                  value={newTraining.tanggal}
                  onChange={(e) => setNewTraining({...newTraining, tanggal: e.target.value})}
                />
              </div>
              <div>
                <Label>Sertifikat (Opsional)</Label>
                <Input
                  placeholder="Link atau nama file sertifikat"
                  value={newTraining.sertifikat}
                  onChange={(e) => setNewTraining({...newTraining, sertifikat: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewTraining(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateTraining}>
                Tambah Pelatihan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Jadwal Piket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pilih Personel</Label>
                <Select value={newSchedule.userId} onValueChange={(value) => setNewSchedule({...newSchedule, userId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih personel" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.namaLengkap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={newSchedule.tanggal}
                  onChange={(e) => setNewSchedule({...newSchedule, tanggal: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Shift</Label>
                <Select value={newSchedule.shift} onValueChange={(value) => setNewSchedule({...newSchedule, shift: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shift 1">Shift 1 (08:00-20:00)</SelectItem>
                    <SelectItem value="Shift 2">Shift 2 (20:00-08:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Posko</Label>
                <Select value={newSchedule.posko} onValueChange={(value) => setNewSchedule({...newSchedule, posko: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih posko" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Posko PMI Kota Tangerang Selatan">Posko PMI Kota Tangerang Selatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateSchedule}>
                Buat Jadwal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Data Personel</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    placeholder="Masukkan nama lengkap"
                    value={editingUser.namaLengkap || ''}
                    onChange={(e) => setEditingUser({...editingUser, namaLengkap: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="email@domain.com"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nomor Handphone</Label>
                  <Input
                    placeholder="081234567890"
                    value={editingUser.nomorHandphone || ''}
                    onChange={(e) => setEditingUser({...editingUser, nomorHandphone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Spesialisasi</Label>
                  <Select value={editingUser.spesialisasi || ''} onValueChange={(value) => setEditingUser({...editingUser, spesialisasi: value})}>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Role</Label>
                  <Select value={editingUser.role || ''} onValueChange={(value) => setEditingUser({...editingUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petugas">Petugas</SelectItem>
                      <SelectItem value="Koordinator">Koordinator</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sub Role</Label>
                  <Select value={editingUser.subRole || ''} onValueChange={(value) => setEditingUser({...editingUser, subRole: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sub role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="posko">Posko</SelectItem>
                      <SelectItem value="ambulance">Ambulance</SelectItem>
                      <SelectItem value="tanggap-darurat-bencana">Tanggap Darurat Bencana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editingUser.status || ''} onValueChange={(value) => setEditingUser({...editingUser, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="siaga">Siaga</SelectItem>
                      <SelectItem value="cuti">Cuti</SelectItem>
                      <SelectItem value="bertugas">Bertugas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpdateUser}>
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={(open) => {
        setShowDeleteConfirmDialog(open)
        if (!open) {
          setDeletingUser(null)
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Personel Secara Permanen</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus personel <strong>{deletingUser?.namaLengkap}</strong> secara permanen?
              Tindakan ini akan menghapus personel dan semua data terkait (absensi, laporan, pelatihan, dll) secara permanen dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmDialog(false)
                setDeletingUser(null)
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUser}
            >
              Hapus Personel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
