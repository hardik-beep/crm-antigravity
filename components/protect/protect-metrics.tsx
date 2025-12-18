"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { ProtectRecord } from "@/lib/types"

interface ProtectMetricsProps {
    records: ProtectRecord[]
    onStatusClick?: (status: string) => void
    onStageClick?: (stage: string) => void
    onPartPaymentClick?: () => void
    onTotalClick?: () => void
    activeStatus?: string
    activeStage?: string
    isPartPaymentActive?: boolean
}

export function ProtectMetrics({ records, onStatusClick, onStageClick, onPartPaymentClick, onTotalClick, activeStatus, activeStage, isPartPaymentActive }: ProtectMetricsProps) {
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
    // Calculate breakdown
    const statusCountsVal: Record<string, number> = {}
    const stageCountsVal: Record<string, number> = {}

    records.forEach((record) => {
        const status = record.status
        if (status && status !== "new") {
            statusCountsVal[status] = (statusCountsVal[status] || 0) + 1
        }

        const stage = record.stage ? record.stage.trim() : "Unknown"
        // Skip adding "Select" or empty stages
        if (stage && stage !== "Select") {
            stageCountsVal[stage] = (stageCountsVal[stage] || 0) + 1
        }
    })

    // Get active statuses sort by count
    const activeStatuses = Object.entries(statusCountsVal)
        .sort(([, a], [, b]) => b - a)

    // Get active stages (excluding Part Payment as we show it separately with daily logic)
    const activeStages = Object.entries(stageCountsVal)
        .filter(([stage]) => stage !== "Part Payment" && stage !== "Unknown" && stage !== "New" && stage !== "Select")
        .sort(([, a], [, b]) => b - a)


    // Get top stages (excluding Part Payment as we show it separately with daily logic)


    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Records */}
            <Card
                className={`bg-primary/5 border-primary/20 cursor-pointer hover:shadow-md transition-all ${(!activeStatus && !activeStage && !isPartPaymentActive) ? "ring-2 ring-primary" : ""}`}
                onClick={() => onTotalClick?.()}
            >
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
                    case "Rescue Started":
                        Icon = TrendingUp; colorClass = "text-orange-500"; bgClass = "bg-orange-500/10"; break;
                    case "closed":
                        Icon = CheckCircle; colorClass = "text-green-600"; bgClass = "bg-green-600/10"; break;
                    default:
                        if (status.toLowerCase().includes("closed")) {
                            Icon = CheckCircle; colorClass = "text-green-500"; bgClass = "bg-green-500/10";
                        }
                        break;
                }

                const isActive = activeStatus === status
                return (
                    <Card
                        key={`status-${status}`}
                        className={`${bgClass.replace('/10', '/5')} border-muted/20 cursor-pointer hover:shadow-md transition-all ${isActive ? "ring-2 ring-primary" : ""}`}
                        onClick={() => onStatusClick?.(status)}
                    >
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate" title={status}>
                                        {status === "Service Not Required and Closed" ? "Closed (NR)" : status}
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


            {/* Part Payment (Today) */}
            <Card
                className={`bg-green-500/5 border-green-500/20 cursor-pointer hover:shadow-md transition-all ${isPartPaymentActive ? "ring-2 ring-primary" : ""}`}
                onClick={() => onPartPaymentClick?.()}
            >
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

            {activeStages.map(([stage, count], index) => {
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

                const isActive = activeStage === stage
                return (
                    <Card
                        key={stage}
                        className={`${bgClass.replace('/10', '/5')} border-muted/20 cursor-pointer hover:shadow-md transition-all ${isActive ? "ring-2 ring-primary" : ""}`}
                        onClick={() => onStageClick?.(stage)}
                    >
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
