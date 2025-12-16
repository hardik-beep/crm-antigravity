"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AgentPerformanceChartProps {
  data: Array<{ name: string; cases: number; settled: number; successRate: number }>
}

export function AgentPerformanceChart({ data }: AgentPerformanceChartProps) {
  const colors = ["#10b981", "#3b82f6", "#f59e0b"]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">Agent Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
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
                formatter={(value: number, name: string) => [
                  value,
                  name === "settled" ? "Settled Cases" : "Total Cases",
                ]}
              />
              <Bar dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Cases">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} opacity={0.3} />
                ))}
              </Bar>
              <Bar dataKey="settled" fill="#10b981" radius={[4, 4, 0, 0]} name="Settled">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
