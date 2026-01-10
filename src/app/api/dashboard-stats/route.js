import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Fetching dashboard statistics...")

    // Use Promise.allSettled for parallel execution and better error handling
    const [
      incidentsResult,
      vehiclesResult,
      bloodStockResult
    ] = await Promise.allSettled([
      // Get active incidents count by type
      prisma.incident.groupBy({
        by: ['type'],
        where: { status: 'active' },
        _count: { type: true }
      }),

      // Get vehicle counts by type
      prisma.vehicle.groupBy({
        by: ['type'],
        _count: { type: true }
      }),

      // Get blood stock
      prisma.bloodStock.findMany({
        select: { type: true, quantity: true }
      })
    ])

    // Process results with error handling
    const stats = {
      activeIncidents: { disaster: 0, ambulance: 0 },
      fleet: { ambulance: 0, motor: 0, operational: 0 },
      personnel: { total: 0, male: 0, female: 0 },
      bloodStock: {},
      beneficiaries: { disaster: 0, ambulance: 0 }
    }

    // Process incidents
    if (incidentsResult.status === 'fulfilled') {
      const incidentGroups = incidentsResult.value
      incidentGroups.forEach(group => {
        if (group.type === 'Bencana Alam') {
          stats.activeIncidents.disaster = group._count.type
        } else if (group.type === 'Kecelakaan' || group.type === 'Darurat Medis') {
          stats.activeIncidents.ambulance += group._count.type
        }
      })
    }

    // Process vehicles
    if (vehiclesResult.status === 'fulfilled') {
      const vehicleGroups = vehiclesResult.value
      vehicleGroups.forEach(group => {
        if (group.type === 'ambulance') {
          stats.fleet.ambulance = group._count.type
        } else if (group.type === 'motor') {
          stats.fleet.motor = group._count.type
        } else if (group.type === 'operational') {
          stats.fleet.operational = group._count.type
        }
      })
    }

    // Process users
    try {
      // Get total count
      const totalUsers = await prisma.user.count({ where: { isApproved: true } })
      stats.personnel.total = totalUsers

      // Get gender counts
      const maleCount = await prisma.user.count({
        where: { isApproved: true, jenisKelamin: 'Laki-laki' }
      })
      const femaleCount = await prisma.user.count({
        where: { isApproved: true, jenisKelamin: 'Perempuan' }
      })

      stats.personnel.male = maleCount
      stats.personnel.female = femaleCount
    } catch (error) {
      console.warn('Failed to get user statistics:', error.message)
    }

    // Process blood stock
    if (bloodStockResult.status === 'fulfilled') {
      const bloodStocks = bloodStockResult.value
      bloodStocks.forEach(stock => {
        stats.bloodStock[stock.type] = stock.quantity
      })
    }

    // Calculate beneficiaries from incidents (count assessments by type)
    try {
      const assessmentStats = await prisma.assessment.groupBy({
        by: ['type'],
        _count: true,
        where: {
          incident: { status: 'active' }
        }
      })

      assessmentStats.forEach(stat => {
        if (stat.type === 'bencana') {
          stats.beneficiaries.disaster = stat._count || 0
        } else if (stat.type === 'ambulance') {
          stats.beneficiaries.ambulance = stat._count || 0
        }
      })
    } catch (error) {
      console.warn('Failed to calculate beneficiaries:', error.message)
      stats.beneficiaries = { disaster: 0, ambulance: 0 }
    }

    console.log('Dashboard statistics fetched successfully')

    // Add caching headers for better performance
    const response = NextResponse.json(stats)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600') // 5 min cache, 10 min stale
    response.headers.set('CDN-Cache-Control', 'max-age=300') // CDN cache for 5 minutes
    response.headers.set('Vercel-CDN-Cache-Control', 'max-age=300')

    return response
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)
    return NextResponse.json({
      error: "Terjadi kesalahan server",
      details: error.message
    }, { status: 500 })
  }
}
