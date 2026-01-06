"use client"

import Map from "@/components/map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommandCenter() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Realtime Map Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <Map />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Heatmap Kejadian Bencana / Kecelakaan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Heatmap akan ditampilkan di sini</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
