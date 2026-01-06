"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // User is signed in, check if they need to register
        checkUserRegistration()
      } else {
        // User is not signed in, show login UI
        // This is handled by the return statement below
      }
    }
  }, [user, isLoaded, router])

  const checkUserRegistration = async () => {
    try {
      console.log('Checking registration for user:', user?.emailAddresses[0]?.emailAddress)
      const response = await fetch('/api/users/check-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses[0]?.emailAddress })
      })

      console.log('API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('API response data:', data)

        if (data.needsRegistration) {
          console.log('Redirecting to register')
          router.push('/register')
        } else if (!data.isApproved) {
          console.log('Redirecting to pending-approval')
          router.push('/pending-approval')
        } else {
          console.log('Redirecting to dashboard')
          router.push('/dashboard')
        }
      } else {
        console.error('API response not ok:', response.status, response.statusText)
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Only show login UI if user is not signed in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memeriksa status akun...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            PMI Kota Tangerang Selatan
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Sistem Informasi Posko Bencana
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selamat Datang
            </h3>
            <p className="text-gray-600 text-sm">
              Masuk untuk mengakses sistem informasi posko PMI
            </p>
          </div>

          <div className="space-y-4">
            <SignInButton mode="modal">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Masuk dengan Akun
              </Button>
            </SignInButton>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Belum memiliki akun? Sistem akan memandu Anda untuk mendaftar.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-center text-xs text-gray-500">
              <p>© 2025 PMI Kota Tangerang Selatan</p>
              <p>Sistem Informasi Posko Bencana</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
