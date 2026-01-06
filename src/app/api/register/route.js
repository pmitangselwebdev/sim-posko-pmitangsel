import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const body = await request.json()
    const { namaLengkap, email, nomorHandphone, spesialisasi, role, subRole, status, alamat, golonganDarah, jenisKelamin, pesan, ttl } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { nomorHandphone }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Nomor handphone sudah terdaftar" }, { status: 400 })
    }

    // Create user with Clerk-compatible data
    const user = await prisma.user.create({
      data: {
        namaLengkap,
        email,
        nomorHandphone,
        spesialisasi,
        role: role || "Petugas",
        subRole,
        status: status || "siaga",
        isApproved: false, // New users need approval
        ttl: ttl ? new Date(ttl) : new Date(), // Use provided TTL or default
        jenisKelamin: jenisKelamin || "Laki-laki",
        alamat: alamat || "",
        golonganDarah: golonganDarah || "A+",
        asalPMI: "PMI Kota Tangerang Selatan",
        pesan: pesan || ""
      }
    })

    return NextResponse.json({ message: "Pengguna berhasil dibuat", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
