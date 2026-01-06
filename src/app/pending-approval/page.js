"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PendingApprovalPage() {
  const { user } = useUser()
  const { toast } = useToast()

  const handleCheckStatus = async () => {
    try {
      const response = await fetch('/api/users/check-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses[0]?.emailAddress })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.isApproved) {
          window.location.href = '/dashboard'
        } else {
          toast({
            title: "Status Akun",
            description: "Akun Anda masih dalam proses persetujuan. Silakan coba lagi nanti.",
            variant: "default"
          })
        }
      }
    } catch (error) {
      console.error('Error checking status:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive"
      })
    }
  }

  const handleLogout = () => {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Menunggu Persetujuan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Akun Anda sedang dalam proses verifikasi oleh administrator.
              Anda akan menerima notifikasi setelah akun disetujui.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCheckStatus}
              className="w-full"
              variant="outline"
            >
              Periksa Status
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Keluar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
