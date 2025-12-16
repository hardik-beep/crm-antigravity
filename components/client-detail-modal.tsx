"use client"

import type { Client } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  FileText,
  History,
  Edit,
  CheckCircle,
  Clock,
} from "lucide-react"

const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  negotiating: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  settled: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  negotiating: "Negotiating",
  settled: "Settled",
  rejected: "Rejected",
}

const loanTypeLabels = {
  personal: "Personal Loan",
  mortgage: "Mortgage",
  auto: "Auto Loan",
  business: "Business Loan",
  "credit-card": "Credit Card",
}

interface ClientDetailModalProps {
  client: Client | null
  open: boolean
  onClose: () => void
}

export function ClientDetailModal({ client, open, onClose }: ClientDetailModalProps) {
  if (!client) return null

  const savingsPercent = Math.round((1 - client.settlementAmount / client.loanAmount) * 100)
  const savingsAmount = client.loanAmount - client.settlementAmount

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <span className="text-lg font-semibold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <DialogTitle
                  className="text-xl font-semibold text-card-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {client.name}
                </DialogTitle>
                <Badge variant="outline" className={cn("mt-1 font-medium", statusStyles[client.settlementStatus])}>
                  {statusLabels[client.settlementStatus]}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-secondary border-border">
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-secondary/50 border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Original Loan</p>
                  <p className="text-xl font-bold text-card-foreground font-mono">
                    ${client.loanAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50 border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Settlement Amount</p>
                  <p className="text-xl font-bold text-primary font-mono">
                    ${client.settlementAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50 border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Savings</p>
                  <p className="text-xl font-bold text-success font-mono">
                    ${savingsAmount.toLocaleString()}
                    <span className="ml-1 text-sm font-normal">({savingsPercent}%)</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-secondary/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">Agent: {client.assignedAgent}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{loanTypeLabels[client.loanType]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{client.creditor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-card-foreground font-mono">
                      Outstanding: ${client.outstandingBalance.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card className="bg-secondary/30 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Important Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date Added</p>
                      <p className="text-sm text-card-foreground">
                        {new Date(client.dateAdded).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Contact</p>
                      <p className="text-sm text-card-foreground">
                        {new Date(client.lastContact).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Next Follow-up</p>
                      <p className="text-sm text-card-foreground">
                        {client.nextFollowUp
                          ? new Date(client.nextFollowUp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card className="bg-secondary/30 border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-card-foreground">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {client.paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {client.paymentHistory.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "rounded-full p-2",
                              payment.status === "completed" ? "bg-success/10" : "bg-warning/10",
                            )}
                          >
                            {payment.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <Clock className="h-4 w-4 text-warning" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground capitalize">
                              {payment.type} Payment
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-card-foreground font-mono">
                            ${payment.amount.toLocaleString()}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              payment.status === "completed"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20",
                            )}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8">No payment history available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card className="bg-secondary/30 border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-card-foreground">Case Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {client.notes || "No notes available for this client."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
