"use client"

import { exportToExcel } from "@/lib/export-utils"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Calendar, Trash2, ChevronDown, Download, MessageSquare } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { CRMRecord, ProtectRecord, SettlementRecord, Status } from "@/lib/types"
import { useAuthStore } from "@/lib/auth-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

const statusLabels: Record<Status, string> = {
  new: "New",
  "in-progress": "In Progress",
  "follow-up": "Follow-up",
  closed: "Closed",
  "No Action Taken": "No Action",
  "Did Not Answered": "Did Not Answer",
  "Service Not Required and Closed": "Closed (NR)",
  "Rescue Started": "Rescue",
  "Settlement Initiated": "Settlement Init.",
  "Settled": "Settled",
}

interface DataTableProps {
  title: string
  records: CRMRecord[]
  type: "protect" | "settlement" | "nexus"
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  partnerFilter: string
  setPartnerFilter: (partner: string) => void
  dpdGroupFilter?: string
  setDpdGroupFilter?: (group: string) => void
  dateRangeStart: string
  dateRangeEnd: string
  setDateRange: (start: string, end: string) => void
  onViewRecord: (record: CRMRecord) => void
  onDeleteRecord: (id: string) => void
  onDeleteRecords?: (ids: string[]) => void
  onUpdateRecord?: (id: string, updates: Partial<CRMRecord>) => void // NEW
  customStatusOptions?: { value: string; label: string }[]
  partPaymentFilter?: string
  setPartPaymentFilter?: (value: string) => void
  uniqueLenders?: string[] // New Prop
  lenderFilter?: string // New Prop
  setLenderFilter?: (value: string) => void // New Prop
  dpdFilter?: string
  setDpdFilter?: (value: string) => void
}

export function DataTable({
  title,
  records,
  type,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  partnerFilter,
  setPartnerFilter,
  dpdGroupFilter,
  setDpdGroupFilter,
  dateRangeStart,
  dateRangeEnd,
  setDateRange,
  onViewRecord,
  onDeleteRecord,
  onDeleteRecords,
  onUpdateRecord,
  customStatusOptions,
  uniqueLenders, // Destructure new prop
  lenderFilter, // Destructure new prop
  setLenderFilter, // Destructure new prop
  ...props
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set())
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const user = useAuthStore(state => state.user)

  const totalPages = Math.ceil(records.length / pageSize)
  const paginatedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleFilterChange = () => {
    setCurrentPage(1)
    setSelectedRecords(new Set())
  }

  const toggleSelectAll = () => {
    // If all on current page are selected, deselect them
    const allOnPageSelected = paginatedRecords.every(r => selectedRecords.has(r.id))

    if (allOnPageSelected) {
      const newSelected = new Set(selectedRecords)
      paginatedRecords.forEach(r => newSelected.delete(r.id))
      setSelectedRecords(newSelected)
    } else {
      // Select all on current page
      const newSelected = new Set(selectedRecords)
      paginatedRecords.forEach(r => newSelected.add(r.id))
      setSelectedRecords(newSelected)
    }
  }

  const selectAllAcrossPages = () => {
    setSelectedRecords(new Set(records.map(r => r.id)))
  }

  const toggleSelectRecord = (id: string) => {
    const newSelected = new Set(selectedRecords)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRecords(newSelected)
  }

  const handleBulkDelete = () => {
    console.log("handleBulkDelete called", { selectedRecords: Array.from(selectedRecords), onDeleteRecords: !!onDeleteRecords })
    if (onDeleteRecords) {
      onDeleteRecords(Array.from(selectedRecords))
      setSelectedRecords(new Set())
      setShowBulkDeleteConfirm(false)
    }
  }

  const handleExport = () => {
    exportToExcel(records as CRMRecord[], `crm-export-${new Date().toISOString().split('T')[0]}`)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export All ({records.length})
                  </DropdownMenuItem>
                  {selectedRecords.size > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        const selectedData = records.filter(r => selectedRecords.has(r.id))
                        exportToExcel(selectedData as CRMRecord[], `crm-export-selected-${new Date().toISOString().split('T')[0]}`)
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Selected ({selectedRecords.size})
                      </DropdownMenuItem>
                      {onDeleteRecords && user?.role !== 'agent' && (
                        <DropdownMenuItem
                          onClick={() => setShowBulkDeleteConfirm(true)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Selected ({selectedRecords.size})
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm text-muted-foreground">{records.length} records</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleFilterChange()
                }}
                className="w-[250px] pl-9 bg-muted/50 border-border text-sm"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v)
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-[150px] bg-muted/50 border-border text-sm">
                <Filter className="mr-2 h-3 w-3" />
                <SelectValue placeholder={type === "nexus" ? "Request Raised" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {type === "nexus" ? "Request Raised" : (customStatusOptions ? "Stages" : "Status")}</SelectItem>
                {customStatusOptions ? (
                  customStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            {/* Partner / Lender Filter */}
            {(type === "settlement" || type === "protect") && uniqueLenders && lenderFilter && setLenderFilter ? (
              <Select
                value={lenderFilter}
                onValueChange={(v) => {
                  setLenderFilter(v)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-[150px] bg-muted/50 border-border text-sm">
                  <SelectValue placeholder="Lender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lenders</SelectItem>
                  {uniqueLenders.map(lender => (
                    <SelectItem key={lender} value={lender}>{lender}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {type === "settlement" && props.dpdFilter && props.setDpdFilter && (
              <Select
                value={props.dpdFilter}
                onValueChange={(v) => {
                  props.setDpdFilter!(v)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-[150px] bg-muted/50 border-border text-sm">
                  <SelectValue placeholder="DPD Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All DPD</SelectItem>
                  <SelectItem value="0-30">0 - 30</SelectItem>
                  <SelectItem value="30-60">30 - 60</SelectItem>
                  <SelectItem value="60-90">60 - 90</SelectItem>
                  <SelectItem value="90+">90+</SelectItem>
                </SelectContent>
              </Select>
            )}

            {!((type === "settlement" || type === "protect") && uniqueLenders && lenderFilter && setLenderFilter) && type !== "nexus" && (
              <Select
                value={partnerFilter}
                onValueChange={(v) => {
                  setPartnerFilter(v)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-[150px] bg-muted/50 border-border text-sm">
                  <SelectValue placeholder="Partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  <SelectItem value="sayyam">Sayyam</SelectItem>
                  <SelectItem value="snapmint">Snapmint</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}

            {type === "protect" && setDpdGroupFilter && (
              // DPD Group Filter removed as per request
              null
            )}

            {type === "protect" && props.partPaymentFilter !== undefined && props.setPartPaymentFilter && (
              <Select
                value={props.partPaymentFilter}
                onValueChange={(v) => {
                  props.setPartPaymentFilter!(v)
                  handleFilterChange()
                }}
              >
                <SelectTrigger className="w-[150px] bg-muted/50 border-border text-sm">
                  <SelectValue placeholder="Part Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Part payment Amount</SelectItem>
                  <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                  <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                  <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                  <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                  <SelectItem value="10000+">Above ₹10,000</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateRangeStart}
                onChange={(e) => {
                  setDateRange(e.target.value, dateRangeEnd)
                  handleFilterChange()
                }}
                className="w-[140px] bg-muted/50 border-border text-sm"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateRangeEnd}
                onChange={(e) => {
                  setDateRange(dateRangeStart, e.target.value)
                  handleFilterChange()
                }}
                className="w-[140px] bg-muted/50 border-border text-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {selectedRecords.size > 0 && selectedRecords.size < records.length &&
          paginatedRecords.every(r => selectedRecords.has(r.id)) && (
            <div className="bg-muted/50 p-2 text-center text-sm text-muted-foreground border-b border-border mb-4 rounded-md">
              All {paginatedRecords.length} records on this page are selected.{" "}
              <button
                onClick={selectAllAcrossPages}
                className="text-primary hover:underline font-medium"
              >
                Select all {records.length} records
              </button>
            </div>
          )}

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className={cn("table-fixed", type === "nexus" ? "min-w-[1200px]" : "min-w-[3200px]")}>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="w-[40px] sticky left-0 bg-muted z-20">
                    <Checkbox
                      checked={paginatedRecords.length > 0 && paginatedRecords.every(r => selectedRecords.has(r.id))}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  {type === "protect" ? (
                    <>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[130px]">
                        Created
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs w-[150px]">
                        Name
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Mobile
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        PAN No
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Plan
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs w-[150px]">
                        Institution
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Acc Type
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[120px]">
                        Account No
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Date Opened
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        EMI Date
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap text-right w-[100px]">
                        EMI Amt
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap text-center w-[60px]">
                        DPD
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap text-center w-[60px]">
                        Curr DPD
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Stage
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[150px]">
                        Part Payment
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs w-[300px]">
                        Remarks
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs w-[80px] sticky right-0 bg-muted z-20 box-decoration-clone border-l border-border/50">Action</TableHead>
                    </>
                  ) : type === "nexus" ? (
                    <>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        User Id
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs w-[150px]">
                        User
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Mobile Number
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs w-[200px]">
                        Email
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Purchase Date
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Form Filled
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">
                        Status
                      </TableHead>
                    </>
                  ) : (
                    <>
                      {/* Settlement Headers */}
                      {/* 1. Created */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[140px]">Created</TableHead>
                      {/* 2. User */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[150px]">User</TableHead>
                      {/* 3. Mobile No */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">Mobile No</TableHead>
                      {/* 4. Debt type */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">Debt type</TableHead>
                      {/* 5. Creditor Name */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[150px]">Creditor Name</TableHead>
                      {/* 6. Credit card no */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[120px]">Credit card no</TableHead>
                      {/* 7. Loan acc no */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[120px]">Loan acc no</TableHead>
                      {/* 8. Loan Amount (was Due amt) */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap text-right w-[100px]">Loan Amount</TableHead>
                      {/* 9. Due date */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">Due date</TableHead>
                      {/* 10. Is emi bounced */}
                      <TableHead className="text-muted-foreground font-medium text-xs text-center w-[100px]">Is emi bounced</TableHead>
                      {/* 11. Is legal notice */}
                      <TableHead className="text-muted-foreground font-medium text-xs text-center w-[100px]">Is legal notice</TableHead>
                      {/* 12. Recommended amt */}
                      <TableHead className="text-muted-foreground font-medium text-xs text-right w-[110px]">Recommended amt</TableHead>
                      {/* 13. Customer wish amt */}
                      <TableHead className="text-muted-foreground font-medium text-xs text-right w-[110px]">Customer wish amt</TableHead>
                      {/* 14. DPD */}
                      <TableHead className="text-muted-foreground font-medium text-xs text-center w-[60px]">DPD</TableHead>
                      {/* 14a. Status */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">Status</TableHead>
                      {/* 14b. Stage */}
                      <TableHead className="text-muted-foreground font-medium text-xs whitespace-nowrap w-[100px]">Stage</TableHead>


                      {/* 15. Lender Contact */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[140px]">Lender Contact</TableHead>
                      {/* 16. Funds Available */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[120px]">Funds Available</TableHead>
                      {/* 17. Settlement Mode */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[130px]">Settlement Mode</TableHead>
                      {/* 18. Number of EMIs */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[120px]">Num EMIs</TableHead>
                      {/* 19. Remarks */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[150px]">Remarks</TableHead>

                      {/* 20. WhatsApp Reachout */}
                      <TableHead className="text-muted-foreground font-medium text-xs w-[120px]">WhatsApp</TableHead>

                      <TableHead className="text-muted-foreground font-medium text-xs w-[80px] sticky right-0 bg-muted z-20 box-decoration-clone">Action</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={type === "protect" ? 16 : (type === "nexus" ? 8 : 20)}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No records found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="hover:bg-muted/20 cursor-pointer"
                      onClick={() => onViewRecord(record)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()} className="sticky left-0 bg-background z-10 border-r border-border/50">
                        <Checkbox
                          checked={selectedRecords.has(record.id)}
                          onCheckedChange={() => toggleSelectRecord(record.id)}
                          aria-label={`Select ${record.name}`}
                        />
                      </TableCell>
                      {type === "nexus" ? (
                        <>
                          <TableCell className="text-xs font-mono whitespace-nowrap">
                            {(record as any).userId || "-"}
                          </TableCell>
                          <TableCell className="text-xs font-medium w-[150px] truncate" title={record.name}>{record.name}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate">{record.mobileNumber}</TableCell>
                          <TableCell className="text-xs truncate max-w-[200px]" title={(record as any).email}>
                            {(record as any).email || "-"}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {(record as any).nexusPurchaseDate}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {record.formFilledDate ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                No
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs whitespace-nowrap", statusStyles[record.status])}>
                              {statusLabels[record.status]}
                            </Badge>
                          </TableCell>
                        </>
                      ) : type === "protect" ? (
                        <>
                          <TableCell className="text-xs whitespace-nowrap">
                            {(() => {
                              const dateVal = (record as ProtectRecord).formFilledDate
                              if (!dateVal) return "-"
                              try {
                                const d = new Date(dateVal.replace(" ", "T"))
                                if (isNaN(d.getTime())) return dateVal
                                return d.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true
                                })
                              } catch (e) {
                                return dateVal
                              }
                            })()}
                          </TableCell>
                          <TableCell className="text-xs font-medium w-[150px] truncate" title={record.name}>{record.name}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate">{record.mobileNumber}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate">{(record as ProtectRecord).panNumber || "-"}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap truncate" title={(record as ProtectRecord).plan}>{(record as ProtectRecord).plan}</TableCell>
                          <TableCell className="text-xs w-[150px] truncate" title={(record as ProtectRecord).institution}>
                            {(record as ProtectRecord).institution}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap truncate">{(record as ProtectRecord).accountType}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate" title={(record as ProtectRecord).accountNumber}>
                            {(record as ProtectRecord).accountNumber}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{(record as ProtectRecord).dateOpened}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{(record as ProtectRecord).emiDate}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap text-right font-mono">
                            ₹{(record as ProtectRecord).emiAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap text-center font-mono">
                            {(record as ProtectRecord).dpd}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap text-center font-mono">
                            {(record as ProtectRecord).currentDpd}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs whitespace-nowrap", statusStyles[record.status])}>
                              {statusLabels[record.status] || record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap truncate" title={record.stage || "-"}>{record.stage || "-"}</TableCell>
                          <TableCell className="text-xs font-mono">
                            {(() => {
                              if (record.stage === 'Skip') return "-"

                              const parts = (record as ProtectRecord).paymentParts || []
                              const receivedParts = parts.filter(p => p.isReceived)
                              const pendingParts = parts.filter(p => !p.isReceived)

                              const receivedSum = receivedParts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
                              const pendingSum = pendingParts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

                              if (receivedSum > 0 || pendingSum > 0) {
                                return (
                                  <div className="flex flex-col gap-1 items-start my-1">
                                    {receivedSum > 0 && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] h-4 px-1 font-normal whitespace-nowrap">
                                        Recvd: ₹{receivedSum.toLocaleString()}
                                      </Badge>
                                    )}
                                    {pendingSum > 0 && (
                                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-[10px] h-4 px-1 font-normal whitespace-nowrap">
                                        Due: ₹{pendingSum.toLocaleString()}
                                      </Badge>
                                    )}
                                  </div>
                                )
                              }

                              return (record as ProtectRecord).partPaymentAmount ? `₹${(record as ProtectRecord).partPaymentAmount?.toLocaleString()}` : "-"
                            })()}
                          </TableCell>
                          <TableCell className="text-xs whitespace-pre-wrap break-words py-2" title={record.remarks?.length ? record.remarks[record.remarks.length - 1].text : "-"}>
                            {record.remarks?.length ? record.remarks[record.remarks.length - 1].text : "-"}
                          </TableCell>
                          <TableCell className="sticky right-0 bg-background z-10 border-l border-border/50">
                            <ActionButtons
                              record={record}
                              onView={onViewRecord}
                              onDelete={setRecordToDelete}
                            />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          {/* 1. Created */}
                          <TableCell className="text-xs whitespace-nowrap">{(record as SettlementRecord).createdDate}</TableCell>
                          {/* 2. User */}
                          <TableCell className="text-xs font-medium w-[150px] truncate" title={record.name}>{record.name}</TableCell>
                          {/* 3. Mobile No */}
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate">{record.mobileNumber}</TableCell>
                          {/* 4. Debt type */}
                          <TableCell className="text-xs whitespace-nowrap truncate">{(record as SettlementRecord).debtType}</TableCell>
                          {/* 5. Creditor Name */}
                          <TableCell className="text-xs w-[150px] truncate" title={(record as SettlementRecord).lenderName}>{(record as SettlementRecord).lenderName}</TableCell>
                          {/* 6. Credit card no */}
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate">{(record as SettlementRecord).creditCardNo}</TableCell>
                          {/* 7. Loan acc no */}
                          <TableCell className="text-xs whitespace-nowrap font-mono truncate">{(record as SettlementRecord).loanAccNo}</TableCell>
                          {/* 8. Loan Amount (was Due amt) */}
                          <TableCell className="text-xs whitespace-nowrap text-right font-mono">₹{((record as SettlementRecord).loanAmount || 0).toLocaleString()}</TableCell>
                          {/* 9. Due date */}
                          <TableCell className="text-xs whitespace-nowrap">{(record as SettlementRecord).dueDate}</TableCell>
                          {/* 10. Is emi bounced */}
                          <TableCell className="text-center">
                            {(record as SettlementRecord).isEmiBounced ? <Badge variant="destructive" className="h-5 text-[10px]">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                          </TableCell>
                          {/* 11. Is legal notice */}
                          <TableCell className="text-center">
                            {(record as SettlementRecord).isLegalNotice ? <Badge variant="destructive" className="h-5 text-[10px]">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                          </TableCell>
                          {/* 12. Recommended amt */}
                          <TableCell className="text-xs whitespace-nowrap text-right font-mono">₹{(record as SettlementRecord).recommendedAmt.toLocaleString()}</TableCell>
                          {/* 13. Customer wish amt */}
                          <TableCell className="text-xs whitespace-nowrap text-right font-mono">₹{(record as SettlementRecord).customerWishAmt.toLocaleString()}</TableCell>
                          {/* 14. DPD */}
                          <TableCell className="text-xs whitespace-nowrap text-center font-mono">{(record as SettlementRecord).dpd}</TableCell>

                          {/* 14a. Status */}
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs whitespace-nowrap", statusStyles[record.status])}>
                              {statusLabels[record.status] || record.status}
                            </Badge>
                          </TableCell>
                          {/* 14b. Stage */}
                          <TableCell className="text-xs whitespace-nowrap truncate" title={record.stage || "-"}>{record.stage || "-"}</TableCell>

                          {/* 15. Lender Contact */}
                          <TableCell className="text-xs">
                            {(record as SettlementRecord).lenderContact || "-"}
                          </TableCell>

                          {/* 16. Funds Available */}
                          <TableCell className="text-xs">
                            {(record as SettlementRecord).fundsAvailable === true ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
                            ) : (record as SettlementRecord).fundsAvailable === false ? (
                              <span className="text-muted-foreground">No</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          {/* 17. Settlement Mode */}
                          <TableCell className="text-xs">
                            {(record as SettlementRecord).settlementOption || <span className="text-muted-foreground">-</span>}
                          </TableCell>

                          {/* 18. Number of EMIs (Conditional) */}
                          <TableCell className="text-xs">
                            {(record as SettlementRecord).emiMonths ? (
                              <Badge variant="secondary" className="font-mono text-[10px]">
                                {(record as SettlementRecord).emiMonths} EMIs
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          {/* 19. Remarks */}
                          <TableCell className="text-xs whitespace-pre-wrap break-words py-2" title={record.remarks?.length ? record.remarks[record.remarks.length - 1].text : "-"}>
                            {record.remarks?.length ? record.remarks[record.remarks.length - 1].text : "-"}
                          </TableCell>

                          {/* 20. WhatsApp Reachout */}
                          <TableCell className="text-xs">
                            {(record as SettlementRecord).whatsappReachout === true ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
                            ) : (record as SettlementRecord).whatsappReachout === false ? (
                              <span className="text-muted-foreground">No</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          {/* 20. Action */}
                          <TableCell className="sticky right-0 bg-background z-10 border-l border-border/50">
                            <ActionButtons
                              record={record}
                              onView={onViewRecord}
                              onDelete={setRecordToDelete}
                            />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {records.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, records.length)} of {records.length}
              </p>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) page = currentPage - 2 + i
                  if (currentPage > totalPages - 2) page = totalPages - 4 + i
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!recordToDelete} onOpenChange={(open: boolean) => !open && setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (recordToDelete) {
                  onDeleteRecord(recordToDelete)
                  setRecordToDelete(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedRecords.size} selected records from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBulkDelete}
            >
              Delete {selectedRecords.size} Records
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card >
  )
}

function ActionButtons({
  record,
  onView,
  onDelete,
}: {
  record: CRMRecord
  onView: (r: CRMRecord) => void
  onDelete: (id: string) => void
}) {
  const user = useAuthStore(state => state.user)
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          onView(record)
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {user?.role !== 'agent' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onDelete(record.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
