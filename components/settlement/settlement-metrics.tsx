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
    // Calculate breakdown
    const statusCountsVal: Record<string, number> = {}
    const stageCountsVal: Record<string, number> = {}

    records.forEach((record) => {
        const status = record.status
        if (status && status !== "new") {
            statusCountsVal[status] = (statusCountsVal[status] || 0) + 1
        }

        const stage = record.stage ? record.stage.trim() : "Unknown"
        if (stage && stage !== "Select") {
            stageCountsVal[stage] = (stageCountsVal[stage] || 0) + 1
        }
    })

    // Get active statuses sort by count
    const activeStatuses = Object.entries(statusCountsVal)
        .sort(([, a], [, b]) => b - a)

    // Get active stages
    const activeStages = Object.entries(stageCountsVal)
        .filter(([stage]) => stage !== "New" && stage !== "Unknown" && stage !== "Select")
        .sort(([, a], [, b]) => b - a)


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

            {/* Dynamic Status Cards */}
            {activeStatuses.map(([status, count]) => {
                let Icon = AlertCircle
                let colorClass = "text-muted-foreground"
                let bgClass = "bg-muted/10"

                switch (status) {
                    case "No Action Taken":
                        Icon = AlertCircle; colorClass = "text-gray-500"; bgClass = "bg-gray-500/10"; break;
                    case "Did Not Answered":
                        Icon = AlertCircle; colorClass = "text-red-500"; bgClass = "bg-red-500/10"; break;
                    case "Service Not Required and Closed":
                        Icon = CheckCircle; colorClass = "text-gray-500"; bgClass = "bg-gray-500/10"; break;
                    case "Settlement Initiated":
                        Icon = Handshake; colorClass = "text-blue-600"; bgClass = "bg-blue-600/10"; break;
                    case "Settled":
                        Icon = CheckCircle; colorClass = "text-green-600"; bgClass = "bg-green-600/10"; break;
                    default:
                        // Fallback for others
                        if (status.toLowerCase().includes("closed")) {
                            Icon = CheckCircle; colorClass = "text-green-500"; bgClass = "bg-green-500/10";
                        }
                        break;
                }

                return (
                    <Card key={`status-${status}`} className={`${bgClass.replace('/10', '/5')} border-muted/20`}>
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate" title={status}>
                                        {status === "Service Not Required and Closed" ? "Closed (NR)" :
                                            status === "Settlement Initiated" ? "Settlement Init." : status}
                                    </p>
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

            {/* Dynamic Stage Cards */}
            {activeStages.map(([stage, count]) => {
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
                } else if (lowerStage.includes("review") || lowerStage.includes("details")) {
                    Icon = AlertCircle
                    colorClass = "text-blue-500"
                    bgClass = "bg-blue-500/10"
                }

                return (
                    <Card key={`stage-${stage}`} className={`${bgClass.replace('/10', '/5')} border-muted/20`}>
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
