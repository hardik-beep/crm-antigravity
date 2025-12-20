"use client"

import { motion, AnimatePresence } from "framer-motion"

import { useState } from "react"
import type { CRMRecord, ProtectRecord, SettlementRecord, Status, Remark } from "@/lib/types"
import { useCRMStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/auth-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  User,
  Phone,
  Building,
  Calendar,
  FileText,
  MessageSquare,
  History,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,

  Check,
  Sparkles,
  Loader2,
} from "lucide-react"

const statusStyles: Record<Status, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "follow-up": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  closed: "bg-green-500/10 text-green-500 border-green-500/20",
  "No Action Taken": "bg-gray-500/10 text-gray-500 border-gray-500/20",
  "Did Not Answered": "bg-red-500/10 text-red-500 border-red-500/20",
  "Service Not Required and Closed": "bg-red-500/10 text-red-500 border-red-500/20",
  "Rescue Started": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Settlement Initiated": "bg-blue-600/10 text-blue-600 border-blue-600/20",
  "Settled": "bg-green-600/10 text-green-600 border-green-600/20",
}

const protectStages = ["Part Payment", "EMI Paid", "Skip", "On Hold Awaiting Confirmation from Lender"]
const settlementStages = [
  "Details Shared",
  "Negotiation",
  "Lender Offer Received",
  "Client Arranging Funds",
  "Part Payment",
]

function DetailRow({ label, value, valueClassName, className }: { label: string; value: string | number | boolean | null | undefined; valueClassName?: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-sm font-medium", valueClassName)}>{String(value || "-")}</p>
    </div>
  )
}

export function RecordDetailModal({ recordId, open, onClose }: { recordId: string | null; open: boolean; onClose: () => void }) {
  const { records, updateRecord, updateRecordStatus, updateRecordStage, updatePartPayment, addRemark, updateRemark, deleteRemark, deleteActivityLog, geminiApiKey } = useCRMStore()
  const [newRemark, setNewRemark] = useState("")
  const [remarkDate, setRemarkDate] = useState("")
  const [isFixing, setIsFixing] = useState(false)
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null)
  const [editingRemarkText, setEditingRemarkText] = useState("")

  const { user } = useAuthStore()
  const record = records.find((r) => r.id === recordId) || null

  if (!record) return null

  const isProtect = record.type === "protect"
  const protectRecord = record as ProtectRecord
  const settlementRecord = record as SettlementRecord

  const handleAddRemark = () => {
    if (!newRemark.trim()) return

    // Add the remark
    addRemark(record.id, {
      text: newRemark,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    })

    // If a follow-up date is selected, update the record
    if (remarkDate) {
      updateRecord(record.id, { nextFollowUpDate: remarkDate } as any)
    }

    setNewRemark("")
    setRemarkDate("")
  }

  const handleUpdateRemark = (remarkId: string) => {
    if (!editingRemarkText.trim()) return
    updateRemark(record.id, remarkId, editingRemarkText)
    setEditingRemarkId(null)
    setEditingRemarkText("")
  }

  const handleDeleteRemark = (remarkId: string) => {
    deleteRemark(record.id, remarkId)
  }

  const startEditRemark = (remark: Remark) => {
    setEditingRemarkId(remark.id)
    setEditingRemarkText(remark.text)
  }

  const handleFixGrammar = async () => {
    if (!newRemark.trim()) return

    if (!geminiApiKey) {
      toast.error("AI Configuration Missing", {
        description: "Please configure your Gemini API Key in Settings to use this feature.",
        action: {
          label: "Go to Settings",
          onClick: () => window.location.href = "/settings"
        }
      })
      return
    }

    setIsFixing(true)
    try {
      const response = await fetch("/api/fix-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newRemark, apiKey: geminiApiKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fix grammar")
      }

      setNewRemark(data.correctedText)
      toast.success("Text corrected successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to correct text", {
        description: error instanceof Error ? error.message : "Unknown error"
      })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-card border-border max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-border bg-card z-10">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-lg font-semibold text-primary">
                    {record.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </span>
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">{record.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={
                        isProtect
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs"
                          : "bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                      }
                    >
                      {record.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {record.partner}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Status & Stage Controls */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="grid grid-cols-[60px_1fr] items-center gap-4">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select
                value={record.status === "new" ? "No Action Taken" : record.status}
                onValueChange={(v) => updateRecordStatus(record.id, v as Status)}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {isProtect ? (
                    <>
                      <SelectItem value="No Action Taken">No Action</SelectItem>
                      <SelectItem value="Did Not Answered">Did Not Answer</SelectItem>
                      <SelectItem value="Service Not Required and Closed">Closed (NR)</SelectItem>
                      <SelectItem value="Rescue Started">Rescue</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="No Action Taken">No Action</SelectItem>
                      <SelectItem value="Did Not Answered">Did Not Answer</SelectItem>
                      <SelectItem value="Service Not Required and Closed">Closed (NR)</SelectItem>
                      <SelectItem value="Settlement Initiated">Settlement Initiated</SelectItem>
                      <SelectItem value="Settled">Settled</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[60px_1fr] items-center gap-4">
              <span className="text-sm text-muted-foreground">Stage:</span>
              <Select
                value={record.stage || ""}
                onValueChange={(v) => updateRecordStage(record.id, v === "Select" ? "" : v)}
              >
                <SelectTrigger className="w-full h-9 text-sm truncate">
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select">Select</SelectItem>
                  {(isProtect ? protectStages : settlementStages).map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Settlement Actions - Editable Fields (Moved Here) */}
          {/* Conditional Inputs based on Stage */}
          <AnimatePresence>
            {(isProtect || (record.type === "settlement" && record.stage === "Part Payment")) && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-muted/30 p-4 rounded-md border border-border/50 space-y-4">

                  {/* SKIP Logic (Protect Only) */}
                  {record.stage === "Skip" && isProtect && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Skipped EMI to be paid on:</span>
                      <input
                        type="date"
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={(record as ProtectRecord).skippedEmiDate || ""}
                        onChange={(e) => updateRecord(record.id, { skippedEmiDate: e.target.value })}
                      />
                    </div>
                  )}

                  {/* PART PAYMENT / EMI PAID Logic */}
                  {(record.stage === "Part Payment" || record.stage === "EMI Paid") && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Number of payment parts</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => {
                            const currentParts = (record as any).paymentParts || []
                            updateRecord(record.id, {
                              paymentParts: [...currentParts, { id: Date.now().toString(), amount: 0, date: "" }]
                            })
                          }}
                        >
                          <Plus className="h-3 w-3" /> Add Part
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {((record as any).paymentParts || []).map((part: any, index: number) => (
                          <div key={part.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 group">

                            {/* Left Side: Amount & Date */}
                            <div className="flex flex-col gap-2 flex-1 mr-4">
                              <div className="flex items-center gap-2">
                                <div className="bg-background border border-input rounded-md px-3 py-1 flex items-center shadow-sm w-[180px]">
                                  <span className="text-muted-foreground text-sm mr-2">₹</span>
                                  <input
                                    type="number"
                                    className="flex h-8 w-full bg-transparent text-base font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Amount"
                                    value={part.amount || ""}
                                    onChange={(e) => {
                                      if (part.isReceived) return
                                      const newParts = ((record as any).paymentParts || []).map((p: any) =>
                                        p.id === part.id ? { ...p, amount: Number(e.target.value) } : p
                                      )
                                      updateRecord(record.id, { paymentParts: newParts })
                                    }}
                                    readOnly={!!part.isReceived}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-1">
                                <span>{part.isReceived ? "Received on" : "Scheduled for"}</span>
                                <div className="relative">
                                  <input
                                    type="date"
                                    className={cn(
                                      "h-6 bg-transparent border-none p-0 text-sm font-medium focus-visible:ring-0 focus-visible:outline-none text-muted-foreground",
                                      part.isReceived ? "cursor-default" : "cursor-pointer"
                                    )}
                                    value={part.date || ""}
                                    onChange={(e) => {
                                      if (part.isReceived) return
                                      const newDate = e.target.value

                                      // Log remark if date changes
                                      if (newDate && newDate !== part.date) {
                                        addRemark(record.id, {
                                          text: `Part payment scheduled: ₹${part.amount} for ${newDate}`,
                                          createdAt: new Date().toISOString(),
                                          createdBy: "System",
                                        })
                                      }

                                      const newParts = ((record as any).paymentParts || []).map((p: any) =>
                                        p.id === part.id ? { ...p, date: newDate } : p
                                      )
                                      updateRecord(record.id, { paymentParts: newParts })
                                    }}
                                    readOnly={!!part.isReceived}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Status Badge & Delete */}
                            <div className="flex items-center gap-3">
                              {/* Delete (Visible for pending) */}
                              {!part.isReceived && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground/50 hover:text-destructive transition-opacity"
                                  onClick={() => {
                                    const newParts = ((record as any).paymentParts || []).filter((p: any) => p.id !== part.id)
                                    updateRecord(record.id, { paymentParts: newParts })
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}

                              <Select
                                value={part.isReceived === true ? "received" : part.isReceived === false ? "pending" : "select"}
                                onValueChange={(val) => {
                                  let isReceived: boolean | undefined = undefined;
                                  if (val === "received") isReceived = true;
                                  if (val === "pending") isReceived = false;
                                  const newParts = ((record as any).paymentParts || []).map((p: any) =>
                                    p.id === part.id ? { ...p, isReceived } : p
                                  )
                                  updateRecord(record.id, { paymentParts: newParts })

                                  if (isReceived === true && part.isReceived !== true) {
                                    addRemark(record.id, {
                                      text: `Part payment received: ₹${part.amount} on ${part.date || "Unknown Date"}`,
                                      createdAt: new Date().toISOString(),
                                      createdBy: "System",
                                    })
                                  } else if (isReceived === false && part.isReceived !== false) {
                                    // Changed to Pending/Scheduled
                                    addRemark(record.id, {
                                      text: `Part payment scheduled: ₹${part.amount} for ${part.date || "Unknown Date"}`,
                                      createdAt: new Date().toISOString(),
                                      createdBy: "System",
                                    })
                                  }
                                }}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "w-[130px] h-9 font-medium border-0 ring-1 ring-inset focus:ring-2",
                                    part.isReceived === true
                                      ? "bg-green-50 text-green-700 ring-green-600/20"
                                      : part.isReceived === false
                                        ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                                        : "bg-muted text-muted-foreground ring-border"
                                  )}
                                >
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="select">Select</SelectItem>
                                  <SelectItem value="pending" className="text-yellow-700 focus:text-yellow-800 focus:bg-yellow-50">Pending</SelectItem>
                                  <SelectItem value="received" className="text-green-700 focus:text-green-800 focus:bg-green-50">Received</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}



                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isProtect && (
            <Card className="bg-muted/10 border-border/50">
              <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Edit2 className="h-3 w-3" />
                  Settlement Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-end">

                  <div className="space-y-1.5">
                    <Label htmlFor="lender-contact" className="text-xs font-medium text-muted-foreground">Lender Contact Info</Label>
                    <div className="relative">
                      <Input
                        id="lender-contact"
                        value={(record as SettlementRecord).lenderContact || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val) && val.length <= 15) {
                            updateRecord(record.id, { lenderContact: val })
                          }
                        }}
                        placeholder="Enter number..."
                        className="h-9 bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="funds-available" className="text-xs font-medium text-muted-foreground">Funds Availability</Label>
                    <Select
                      value={(record as SettlementRecord).fundsAvailable === null ? "unselected" : (record as SettlementRecord).fundsAvailable ? "yes" : "no"}
                      onValueChange={(val) => updateRecord(record.id, { fundsAvailable: val === "yes" ? true : val === "no" ? false : null })}
                    >
                      <SelectTrigger id="funds-available" className="h-9 bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unselected">Select</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="settlement-mode" className="text-xs font-medium text-muted-foreground">Settlement Mode</Label>
                    <Select
                      value={(record as SettlementRecord).settlementOption || "unselected"}
                      onValueChange={(val) => updateRecord(record.id, { settlementOption: val === "unselected" ? null : val as any })}
                    >
                      <SelectTrigger id="settlement-mode" className="h-9 bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unselected">Select</SelectItem>
                        <SelectItem value="One Time">One Time</SelectItem>
                        <SelectItem value="EMI">EMI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of EMIs - Conditionally visible */}
                  {(record as SettlementRecord).settlementOption === "EMI" && (
                    <div className="space-y-1.5 animation-in fade-in slide-in-from-top-1 duration-200">
                      <Label htmlFor="emi-months" className="text-xs font-medium text-muted-foreground">Number of EMIs</Label>
                      <Select
                        value={(record as SettlementRecord).emiMonths?.toString() || ""}
                        onValueChange={(val) => updateRecord(record.id, { emiMonths: Number(val) as any })}
                      >
                        <SelectTrigger id="emi-months" className="h-9 bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 EMIs</SelectItem>
                          <SelectItem value="3">3 EMIs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp-reach" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      WhatsApp Reachout
                    </Label>
                    <Select
                      value={(record as SettlementRecord).whatsappReachout === null ? "unselected" : (record as SettlementRecord).whatsappReachout ? "yes" : "no"}
                      onValueChange={(val) => updateRecord(record.id, { whatsappReachout: val === "yes" ? true : val === "no" ? false : null })}
                    >
                      <SelectTrigger id="whatsapp-reach" className="h-9 bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unselected">Select</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Section: Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary/80 font-medium pb-2 border-b border-border/50">
              <FileText className="h-4 w-4" />
              <h3>Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Contact Info */}
              <Card className="bg-muted/20 border-border shadow-none">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Mobile</span>
                    <span className="text-sm font-mono">{record.mobileNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Partner</span>
                    <span className="text-sm capitalize">{record.partner}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Form Filled</span>
                    <span className="text-sm">{record.formFilledDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Info */}
              <Card className="bg-muted/20 border-border shadow-none">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Source</span>
                    <span className="text-sm truncate max-w-[120px]" title={record.uploadedFrom}>{record.uploadedFrom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Uploaded</span>
                    <span className="text-sm">{new Date(record.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

            </div>



            {/* Specific Details */}
            <Card className="bg-muted/20 border-border shadow-none">
              <CardContent className="pt-4">
                {isProtect ? (
                  <div className="grid grid-cols-3 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">PAN Number</p>
                      <p className="text-sm font-medium font-mono">{(protectRecord as any).panNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Plan</p>
                      <p className="text-sm font-medium">{protectRecord.plan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Institution</p>
                      <p className="text-sm font-medium">{protectRecord.institution}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Account No</p>
                      <p className="text-sm font-medium font-mono break-all">{protectRecord.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                      <p className="text-sm font-medium">{protectRecord.accountType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date Opened</p>
                      <p className="text-sm font-medium">{protectRecord.dateOpened}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">EMI Amount</p>
                      <p className="text-sm font-medium font-mono">₹{protectRecord.emiAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">EMI Date</p>
                      <p className="text-sm font-medium">{protectRecord.emiDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Original DPD</p>
                      <p className="text-sm font-medium">{protectRecord.dpd}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current DPD</p>
                      <p className="text-sm font-medium">{protectRecord.currentDpd}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* 1. Created */}
                      <DetailRow label="Created" value={(record as SettlementRecord).createdDate} />
                      {/* 2. User */}
                      <DetailRow label="User" value={record.name} />
                      {/* 3. Mobile No */}
                      <DetailRow label="Mobile No" value={record.mobileNumber} />
                      {/* 4. Debt Type */}
                      <DetailRow label="Debt Type" value={(record as SettlementRecord).debtType} />
                      {/* 5. Creditor Name */}
                      <DetailRow label="Creditor Name" value={(record as SettlementRecord).lenderName} />
                      {/* 6. Credit Card No */}
                      <DetailRow label="Credit Card No" value={(record as SettlementRecord).creditCardNo} />
                      {/* 7. Loan Account No */}
                      <DetailRow label="Loan Account No" value={(record as SettlementRecord).loanAccNo} />
                      {/* 8. Loan Amount */}
                      <DetailRow label="Loan Amount" value={`₹${((record as SettlementRecord).loanAmount || 0).toLocaleString()}`} />
                      {/* 9. Due Date */}
                      <DetailRow label="Due Date" value={(record as SettlementRecord).dueDate} />
                      {/* 10. Is EMI Bounced */}
                      <DetailRow
                        label="Is EMI Bounced"
                        value={(record as SettlementRecord).isEmiBounced ? "Yes" : "No"}
                        valueClassName={(record as SettlementRecord).isEmiBounced ? "text-destructive font-medium" : ""}
                      />
                      {/* 11. Is Legal Notice */}
                      <DetailRow
                        label="Is Legal Notice"
                        value={(record as SettlementRecord).isLegalNotice ? "Yes" : "No"}
                        valueClassName={(record as SettlementRecord).isLegalNotice ? "text-destructive font-medium" : ""}
                      />
                      {/* 12. Recommended Amount */}
                      <DetailRow label="Recommended Amount" value={`₹${((record as SettlementRecord).recommendedAmt || 0).toLocaleString()}`} />
                      {/* 13. Customer Wish Amount */}
                      <DetailRow label="Customer Wish Amount" value={`₹${((record as SettlementRecord).customerWishAmt || 0).toLocaleString()}`} />
                      {/* 14. DPD (Static) */}
                      <DetailRow label="DPD" value={(record as SettlementRecord).dpd} className="text-center" />
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Section: Remarks */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary/80 font-medium pb-2 border-b border-border/50">
              <MessageSquare className="h-4 w-4" />
              <h3>Remarks</h3>
            </div>

            <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout" initial={false}>
                  {record.remarks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8 text-muted-foreground text-sm italic"
                    >
                      No remarks yet. Add one below.
                    </motion.div>
                  ) : (
                    record.remarks.map((remark) => (
                      <motion.div
                        key={remark.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-background rounded-md p-3 border border-border/50 shadow-sm"
                      >
                        {editingRemarkId === remark.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingRemarkText}
                              onChange={(e) => setEditingRemarkText(e.target.value)}
                              className="min-h-[60px] text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setEditingRemarkId(null)} className="h-7 text-xs">
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => handleUpdateRemark(remark.id)} className="h-7 text-xs">
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">{remark.text}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-border/50">
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {remark.createdBy} • {new Date(remark.createdAt).toLocaleString()}
                                {remark.updatedAt && " (edited)"}
                              </span>
                              <div className="flex">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-5 w-5 hover:bg-muted"
                                  onClick={() => startEditRemark(remark)}
                                >
                                  <Edit2 className="h-3 w-3 text-muted-foreground" />
                                </Button>
                                {user?.role === 'admin' && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleDeleteRemark(remark.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Add Remark Input */}
              <div className="flex flex-col gap-2 pt-2">
                <Textarea
                  placeholder="Type a new remark here..."
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  className="min-h-[80px] bg-background text-sm resize-none focus-visible:ring-1 pr-10"
                />

                {/* Magic Fix Button - Toolbar */}
                <div className="flex flex-wrap gap-2 justify-between items-center bg-muted/30 p-2 rounded-md border border-border/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Follow-up:</span>
                    <input
                      type="date"
                      className="h-8 w-[130px] rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={remarkDate}
                      onChange={(e) => setRemarkDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                      onClick={handleFixGrammar}
                      disabled={!newRemark.trim() || isFixing}
                      title="Fix grammar & translate with AI"
                    >
                      {isFixing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1.5" />
                      )}
                      Magic Fix
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <Button onClick={handleAddRemark} disabled={!newRemark.trim()} size="sm" className="px-4">
                      <Plus className="h-3 w-3 mr-1.5" /> Add Remark
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Activity Log */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary/80 font-medium pb-2 border-b border-border/50">
              <History className="h-4 w-4" />
              <h3>Activity Log</h3>
            </div>

            <div className="relative pl-2">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/60" />
              <div className="space-y-6">
                {record.activityLog.slice().reverse().map((entry) => (
                  <div key={entry.id} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start w-full gap-4">
                        <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                        {user?.role === 'admin' && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 text-muted-foreground hover:text-destructive -mt-1"
                            onClick={() => deleteActivityLog(record.id, entry.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{entry.details}</p>
                      <p className="text-[10px] text-muted-foreground mt-2 font-medium opacity-70 flex items-center gap-2">
                        <span className="bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 text-primary">@{entry.user}</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Footer - Fixed */}
        <div className="p-4 border-t border-border bg-card z-10 flex justify-end">
          <Button onClick={onClose} className="px-8">
            Update
          </Button>
        </div>
      </DialogContent >
    </Dialog >
  )
}
