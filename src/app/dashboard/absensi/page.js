"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, UserCheck, UserX, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMounted } from "@/hooks/use-mounted"

export default function Absensi() {
  const { toast } = useToast()
  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState("today")
  const [attendances, setAttendances] = useState([])
  const [users, setUsers] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showCheckOut, setShowCheckOut] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const [checkInData, setCheckInData] = useState({
    userId: "",
    shift: "",
    posko: ""
  })

  const [checkOutData, setCheckOutData] = useState({
    notes: ""
  })

  useEffect(() => {
    fetchUsers()
    fetchAttendances()
  }, [selectedDate])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchAttendances = async () => {
    try {
      const response = await fetch(`/api/attendances?date=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setAttendances(data)
      }
    } catch (error) {
      console.error('Failed to fetch attendances:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      const response = await fetch('/api/attendances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check-in',
          userId: checkInData.userId,
          shift: checkInData.shift,
          posko: checkInData.posko
        })
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Check-in berhasil!",
          duration: 3000,
        })
        setShowCheckIn(false)
        setCheckInData({ userId: "", shift: "", posko: "" })
        fetchAttendances()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || 'Gagal check-in',
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

  const handleCheckOut = async () => {
    try {
      const response = await fetch('/api/attendances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check-out',
          userId: currentUser?.id,
          notes: checkOutData.notes
        })
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Check-out berhasil!",
          duration: 3000,
        })
        setShowCheckOut(false)
        setCheckOutData({ notes: "" })
        setCurrentUser(null)
        fetchAttendances()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || 'Gagal check-out',
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

  const getAttendanceStats = () => {
    const total = users.length
    const present = attendances.filter(a => a.status === 'present').length
    const absent = total - present
    const late = attendances.filter(a => a.status === 'late').length
    const sick = attendances.filter(a => a.status === 'sick').length
    const leave = attendances.filter(a => a.status === 'leave').length

    return { total, present, absent, late, sick, leave }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-green-500"><UserCheck className="w-3 h-3 mr-1" />Hadir</Badge>
      case "absent":
        return <Badge variant="destructive"><UserX className="w-3 h-3 mr-1" />Tidak Hadir</Badge>
      case "late":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Terlambat</Badge>
      case "sick":
        return <Badge variant="outline" className="border-orange-500 text-orange-600"><AlertTriangle className="w-3 h-3 mr-1" />Sakit</Badge>
      case "leave":
        return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />Cuti</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = getAttendanceStats()

  // Only render components after hydration to prevent classList errors
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sistem Absensi Petugas</h1>
          <div className="flex gap-2">
            <Button disabled>
              Absensi Masuk
            </Button>
            <Button variant="outline" disabled>
              Absensi Pulang
            </Button>
          </div>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sistem Absensi Petugas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCheckIn(true)}>
            Absensi Masuk
          </Button>
          <Button variant="outline" onClick={() => setShowCheckOut(true)}>
            Absensi Pulang
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Pilih Tanggal:</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Badge variant="outline" className="ml-auto">
              {new Date(selectedDate).toLocaleDateString("id-ID", {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Petugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sakit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sick}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.leave}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Absensi Hari Ini</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Absensi Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Posko</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const attendance = attendances.find(a => a.userId === user.id)
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={user.foto} />
                            <AvatarFallback>{user.namaLengkap.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{user.namaLengkap}</TableCell>
                        <TableCell>{user.spesialisasi}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.subRole || user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {attendance?.checkIn ?
                            new Date(attendance.checkIn).toLocaleTimeString("id-ID", {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {attendance?.checkOut ?
                            new Date(attendance.checkOut).toLocaleTimeString("id-ID", {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'
                          }
                        </TableCell>
                        <TableCell>{getStatusBadge(attendance?.status || 'absent')}</TableCell>
                        <TableCell>{attendance?.shift || '-'}</TableCell>
                        <TableCell>{attendance?.posko || '-'}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Persentase Kehadiran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Kehadiran Hari Ini</span>
                    <span className="font-bold text-lg">
                      {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      Hadir
                    </span>
                    <span>{stats.present}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      Tidak Hadir
                    </span>
                    <span>{stats.absent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      Terlambat
                    </span>
                    <span>{stats.late}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      Sakit
                    </span>
                    <span>{stats.sick}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      Cuti
                    </span>
                    <span>{stats.leave}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{new Date(attendance.tanggal).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>{attendance.user.namaLengkap}</TableCell>
                      <TableCell>
                        {attendance.checkIn ?
                          new Date(attendance.checkIn).toLocaleString("id-ID") : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {attendance.checkOut ?
                          new Date(attendance.checkOut).toLocaleString("id-ID") : '-'
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                      <TableCell>{attendance.shift || '-'}</TableCell>
                      <TableCell>{attendance.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Check-In Dialog */}
      <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Absensi Masuk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Select value={checkInData.userId} onValueChange={(value) => setCheckInData({...checkInData, userId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih nama lengkap" />
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
              <Label>Shift</Label>
              <Select value={checkInData.shift} onValueChange={(value) => setCheckInData({...checkInData, shift: value})}>
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
              <Select value={checkInData.posko} onValueChange={(value) => setCheckInData({...checkInData, posko: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih posko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Posko PMI Kota Tangerang Selatan">Posko PMI Kota Tangerang Selatan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCheckIn(false)}>
                Batal
              </Button>
              <Button onClick={handleCheckIn}>
                Absensi Masuk
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Check-Out Dialog */}
      <Dialog open={showCheckOut} onOpenChange={setShowCheckOut}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Absensi Pulang</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Select value={currentUser?.id || ""} onValueChange={(value) => {
                const user = users.find(u => u.id.toString() === value)
                setCurrentUser(user)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih nama lengkap" />
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
              <Label>Catatan (Opsional)</Label>
              <Textarea
                placeholder="Catatan tambahan jika ada"
                value={checkOutData.notes}
                onChange={(e) => setCheckOutData({...checkOutData, notes: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCheckOut(false)}>
                Batal
              </Button>
              <Button onClick={handleCheckOut}>
                Absensi Pulang
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
