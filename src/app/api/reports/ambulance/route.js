import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateAmbulanceReportPDF } from "@/lib/pdfGenerator"

export async function POST(request) {
  try {
    const body = await request.json()
    const { formId } = body

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    // Get the ambulance form data
    const ambulanceForm = await prisma.ambulanceForm.findUnique({
      where: { id: parseInt(formId) },
      include: {
        user: {
          select: {
            namaLengkap: true,
            spesialisasi: true
          }
        }
      }
    })

    if (!ambulanceForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Generate PDF
    const pdfBuffer = await generateAmbulanceReportPDF(ambulanceForm)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="kartu-luka-${ambulanceForm.data.namaKorban}-${new Date().toISOString().slice(0, 10)}.pdf"`
      }
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}