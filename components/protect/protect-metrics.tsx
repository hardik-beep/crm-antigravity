"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { ProtectRecord } from "@/lib/types"

interface ProtectMetricsProps {
    records: ProtectRecord[]
}

export function ProtectMetrics({ records }: ProtectMetricsProps) {
    // Calculate total
    const totalRecords = records.length

    // Calculate daily part payment count
    const today = new Date().toISOString().split('T')[0]
    let partPaymentTodayCount = 0
    records.forEach(r => {
        if (r.paymentParts?.some(p => p.date === today)) {
            partPaymentTodayCount++
        }
    })

    // Calculate stage breakdown
    const stageCounts: Record<string, number> = {}

    // Explicit count for No Action status
    let noActionCount = 0

    records.forEach((record) => {
        // Check for No Action status (case-insensitive checks usually safer but using strict matching as per types)
        if (record.status === "No Action Taken") {
            noActionCount++
        }

        const stage = record.stage || "Unknown"
        // Skip adding "Select" or empty stages to general stage counts if we want to ignore them or handle differently
        // But for now, we just standardise logic
        if (stage && stage !== "Select") {
            stageCounts[stage] = (stageCounts[stage] || 0) + 1
        }
    })

    // Get top stages (excluding Part Payment as we show it separately with daily logic)
    const stages = Object.entries(stageCounts)
        .filter(([stage]) => stage !== "Part Payment" && stage !== "Unknown")
        .sort(([, a], [, b]) => b - a)

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Records */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Records</p>
                            <h3 className="text-2xl font-bold mt-1 text-primary">{totalRecords}</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* No Action Stage */}
            <Card className="bg-muted/10 border-muted/20">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No Action</p>
                            <h3 className="text-2xl font-bold mt-1">{noActionCount}</h3>
                        </div>
                        <div className="p-2 bg-muted/10 rounded-full">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Part Payment (Today) */}
            <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider" title="Scheduled for Today">Part Payment (Today)</p>
                            <h3 className="text-2xl font-bold mt-1 text-green-600">{partPaymentTodayCount}</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {stages.map(([stage, count], index) => {
                // Dynamic icon and color assignment based on stage name keywords or index
                let Icon = Clock
                let colorClass = "text-muted-foreground"
                let bgClass = "bg-muted/10"

                const lowerStage = stage.toLowerCase()
                if (lowerStage.includes("skip")) {
                    Icon = TrendingUp
                    colorClass = "text-orange-500"
                    bgClass = "bg-orange-500/10"
                } else if (lowerStage.includes("payment")) {
                    Icon = CheckCircle
                    colorClass = "text-green-500"
                    bgClass = "bg-green-500/10"
                } else if (lowerStage.includes("review")) {
                    Icon = AlertCircle
                    colorClass = "text-blue-500"
                    bgClass = "bg-blue-500/10"
                }

                return (
                    <Card key={stage} className={`${bgClass.replace('/10', '/5')} border-muted/20`}>
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate" title={stage}>{stage}</p>
                                    <h3 className="text-2xl font-bold mt-1">{count}</h3>
                                </div>
                                <div className={`p-2 rounded-full ${bgClass}`}>
                                    <Icon className={`h-4 w-4 ${colorClass}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
