"use client"

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MonthlyTrendChartProps {
  data: Array<{ month: string; settlements: number; newClients: number; revenue: number }>
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <Card className="bg-card border-border col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-card-foreground">Monthly Performance Trend</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span className="text-muted-foreground">Settlements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
              <span className="text-muted-foreground">New Clients</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="settlementsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clientsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                axisLine={{ stroke: "oklch(0.28 0.005 260)" }}
              />
              <YAxis tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} axisLine={{ stroke: "oklch(0.28 0.005 260)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.005 260)",
                  border: "1px solid oklch(0.28 0.005 260)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="settlements"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#settlementsGradient)"
              />
              <Area
                type="monotone"
                dataKey="newClients"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#clientsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
