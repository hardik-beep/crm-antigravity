"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle, Clock, Gavel, Handshake } from "lucide-react"
import type { SettlementRecord } from "@/lib/types"

interface SettlementMetricsProps {
    records: SettlementRecord[]
}

export function SettlementMetrics({ records }: SettlementMetricsProps) {
    // Calculate total
    const totalRecords = records.length

    // Calculate stage breakdown
    const stageCounts: Record<string, number> = {}
    let noActionCount = 0

    records.forEach((record) => {
        if (record.status === "No Action Taken") {
            noActionCount++
        }
        const stage = record.stage || "Unknown"
        if (stage && stage !== "Select") {
            stageCounts[stage] = (stageCounts[stage] || 0) + 1
        }
    })

    // Get top stages or specific important ones
    const stages = Object.entries(stageCounts)
        .sort(([, a], [, b]) => b - a) // Sort by count descending

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Records</p>
                            <h3 className="text-2xl font-bold mt-1 text-primary">{totalRecords}</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Handshake className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* No Action Status Card */}
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

            {stages.map(([stage, count], index) => {
                // Dynamic icon and color assignment based on stage name keywords
                let Icon = Clock
                let colorClass = "text-muted-foreground"
                let bgClass = "bg-muted/10"

                const lowerStage = stage.toLowerCase()
                if (lowerStage.includes("legal")) {
                    Icon = Gavel
                    colorClass = "text-red-500"
                    bgClass = "bg-red-500/10"
                } else if (lowerStage.includes("negotiation") || lowerStage.includes("discount")) {
                    Icon = TrendingUp
                    colorClass = "text-orange-500"
                    bgClass = "bg-orange-500/10"
                } else if (lowerStage.includes("resolved") || lowerStage.includes("settled") || lowerStage.includes("payment")) {
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
