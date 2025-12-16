"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { DPDGroup } from "@/lib/types"

interface DPDPieChartProps {
  data: { group: DPDGroup; count: number }[]
}

const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#dc2626"]

export function DPDPieChart({ data }: DPDPieChartProps) {
  const chartData = data.map((d, i) => ({
    name: d.group,
    value: d.count,
    fill: COLORS[i % COLORS.length],
  }))

  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">DPD Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {total === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => (percent > 0 ? `${(percent * 100).toFixed(0)}%` : "")}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value} records`, "Count"]}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: "11px", paddingLeft: "10px" }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
