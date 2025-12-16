"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PartnerBreakdownProps {
  sayyamProtect: number
  sayyamSettlement: number
  snapmintProtect: number
  snapmintSettlement: number
}

export function PartnerBreakdown({
  sayyamProtect,
  sayyamSettlement,
  snapmintProtect,
  snapmintSettlement,
}: PartnerBreakdownProps) {
  const sayyamTotal = sayyamProtect + sayyamSettlement
  const snapmintTotal = snapmintProtect + snapmintSettlement

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Partner Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sayyam */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Sayyam</span>
            <span className="text-sm font-bold text-foreground">{sayyamTotal}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-blue-500/10 p-2">
              <p className="text-xs text-muted-foreground">Protect</p>
              <p className="text-lg font-bold text-blue-500">{sayyamProtect}</p>
            </div>
            <div className="flex-1 rounded-lg bg-green-500/10 p-2">
              <p className="text-xs text-muted-foreground">Settlement</p>
              <p className="text-lg font-bold text-green-500">{sayyamSettlement}</p>
            </div>
          </div>
        </div>

        {/* Snapmint */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Snapmint</span>
            <span className="text-sm font-bold text-foreground">{snapmintTotal}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-blue-500/10 p-2">
              <p className="text-xs text-muted-foreground">Protect</p>
              <p className="text-lg font-bold text-blue-500">{snapmintProtect}</p>
            </div>
            <div className="flex-1 rounded-lg bg-green-500/10 p-2">
              <p className="text-xs text-muted-foreground">Settlement</p>
              <p className="text-lg font-bold text-green-500">{snapmintSettlement}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
