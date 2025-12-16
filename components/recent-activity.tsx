import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Client } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CheckCircle, Clock, AlertCircle, ArrowRight, XCircle } from "lucide-react"

interface RecentActivityProps {
  clients: Client[]
}

const statusConfig = {
  settled: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  "in-progress": { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  negotiating: { icon: ArrowRight, color: "text-purple-500", bg: "bg-purple-500/10" },
  pending: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
}

export function RecentActivity({ clients }: RecentActivityProps) {
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
    .slice(0, 5)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-card-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentClients.map((client) => {
          const config = statusConfig[client.settlementStatus]
          const Icon = config.icon
          return (
            <div key={client.id} className="flex items-start gap-3">
              <div className={cn("rounded-lg p-2", config.bg)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-card-foreground">{client.name}</p>
                <p className="text-xs text-muted-foreground">
                  {client.settlementStatus === "settled"
                    ? `Settlement completed - $${client.settlementAmount.toLocaleString()}`
                    : client.notes.slice(0, 50) + (client.notes.length > 50 ? "..." : "")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(client.lastContact).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
