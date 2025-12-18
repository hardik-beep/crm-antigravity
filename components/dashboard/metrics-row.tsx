"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Shield, Handshake, TrendingUp, TrendingDown, Users, AlertTriangle, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricTileProps {
    title: string
    value: number | string
    subtitle?: string
    icon: React.ElementType
    className?: string
    iconClassName?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    onClick?: () => void
    isActive?: boolean
}

function MetricTile({ title, value, subtitle, icon: Icon, className, iconClassName, trend, onClick, isActive }: MetricTileProps) {
    return (
        <Card
            className={cn(
                "overflow-hidden shadow-sm transition-all",
                onClick && "cursor-pointer hover:shadow-md",
                isActive && "ring-2 ring-primary ring-offset-2",
                className
            )}
            onClick={onClick}
        >
            <CardContent className="p-4 flex items-start justify-between h-full">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold">{value}</h2>
                        {trend && (
                            <div className={cn("flex items-center text-xs font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
                                {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {trend.value}%
                            </div>
                        )}
                    </div>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                <div className={cn("p-2 rounded-full bg-primary/10 flex items-center justify-center", iconClassName)}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    )
}

interface MetricsRowProps {
    stats: {
        totalRequests: number
        newRequestsToday: number
        newProtectToday: number
        newSettlementToday: number
        totalProtect: number
        totalSettlement: number
        sayyamProtect: number
        snapmintProtect: number
        sayyamSettlement: number
        snapmintSettlement: number
        casesNPAToday: number
        totalNexus: number
        nexusFormFilled: number
        nexusFormNotFilled: number
    }
    onNpaClick?: () => void
    isNpaFilterActive?: boolean
    hideNewToday?: boolean
    hideNpa?: boolean
    hideSettlement?: boolean
    hideProtect?: boolean
    requestsTitle?: string
}

export function MetricsRow({
    stats,
    onNpaClick,
    isNpaFilterActive,
    hideNewToday = false,
    hideNpa = false,
    hideSettlement = false,
    hideProtect = false,
    requestsTitle = "All Requests"
}: MetricsRowProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Total Requests */}
            <MetricTile
                title={requestsTitle}
                value={stats.totalRequests}
                subtitle="All time"
                icon={FileText}
                iconClassName="text-primary bg-primary/10"
                className="h-full"
            />

            {/* New Today */}
            {!hideNewToday && (
                <MetricTile
                    title="New Today"
                    value={stats.newRequestsToday}
                    subtitle={`${stats.newProtectToday} Protect • ${stats.newSettlementToday} Settlement`}
                    icon={TrendingUp}
                    iconClassName="text-green-500 bg-green-500/10"
                    className="h-full"
                />
            )}

            {/* NPA Today */}
            {!hideNpa && (
                <MetricTile
                    title="Cases NPA Today"
                    value={stats.casesNPAToday}
                    icon={AlertTriangle}
                    iconClassName="text-red-500 bg-red-500/10"
                    className="h-full"
                />
            )}

            {/* Total Protect */}
            {!hideProtect && (
                <MetricTile
                    title="Total Protect"
                    value={stats.totalProtect}
                    icon={Shield}
                    iconClassName="text-blue-500 bg-blue-500/10"
                    className="h-full"
                />
            )}

            {/* Total Settlement */}
            {!hideSettlement && (
                <MetricTile
                    title="Total Settlement"
                    value={stats.totalSettlement}
                    icon={Handshake}
                    iconClassName="text-orange-500 bg-orange-500/10"
                    className="h-full"
                />
            )}

            {/* Nexus Purchased */}
            <MetricTile
                title="Nexus Purchased"
                value={stats.totalNexus}
                subtitle={`${stats.nexusFormFilled} Request Raised • ${stats.nexusFormNotFilled} Not Raised`}
                icon={ShoppingBag}
                iconClassName="text-purple-500 bg-purple-500/10"
                className="h-full"
            />
        </div>
    )
}
