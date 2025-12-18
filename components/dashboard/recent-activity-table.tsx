"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, Eye, ArrowRight, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import type { CRMRecord } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RecentActivityTableProps {
    records: CRMRecord[]
    onView: (record: CRMRecord) => void
    title?: string
}

export function RecentActivityTable({ records, onView, title = "Recent Activity" }: RecentActivityTableProps) {
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    // Helper to determine the task for today with natural language
    const getTaskDescription = (record: CRMRecord) => {
        // Calculate today in local timezone
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const today = `${year}-${month}-${day}`

        const name = record.name || "Client"

        if (record.type === "protect") {
            const r = record as any

            // Check part payments
            const partPayment = r.paymentParts?.find((p: any) => p.date === today && !p.isReceived)
            if (partPayment) {
                return (
                    <span>
                        <span className="font-semibold text-foreground">{name}</span> has to make a <span className="font-semibold text-blue-600">Protect</span> payment of <span className="font-bold text-green-600">₹{partPayment.amount}</span> today.
                    </span>
                )
            }

            // Check skipped EMI
            if (r.skippedEmiDate === today) {
                return (
                    <span>
                        <span className="font-semibold text-foreground">{name}</span> has a skipped <span className="font-semibold text-blue-600">Protect</span> EMI payment scheduled for today.
                    </span>
                )
            }

            // Check follow up
            if (r.nextFollowUpDate === today) {
                return (
                    <span>
                        You need to have a conversation today with <span className="font-semibold text-foreground">{name}</span> <span className="text-muted-foreground">({r.institution || "Unknown"})</span>.
                    </span>
                )
            }
        } else if (record.type === "settlement") {
            const r = record as any

            // Check part payments
            const partPayment = r.paymentParts?.find((p: any) => p.date === today && !p.isReceived)
            if (partPayment) {
                return (
                    <span>
                        <span className="font-semibold text-foreground">{name}</span> has to make a <span className="font-semibold text-orange-600">Settlement</span> payment of <span className="font-bold text-green-600">₹{partPayment.amount}</span> today.
                    </span>
                )
            }

            if (r.nextFollowUpDate === today) {
                return (
                    <span>
                        You need to have a conversation today with <span className="font-semibold text-foreground">{name}</span> <span className="text-muted-foreground">({r.lenderName || "Unknown"})</span>.
                    </span>
                )
            }
            if (r.dueDate === today) {
                return (
                    <span>
                        You need to have a conversation today with <span className="font-semibold text-foreground">{name}</span> <span className="text-muted-foreground">({r.lenderName || "Unknown"})</span>.
                    </span>
                )
            }
        }
        return <span>Action required for {name}.</span>
    }

    // Sort by filter criteria priority? Or just standard date?
    // User wants "Todo list", so maybe no specific sort needed if filtered. 
    // Keeping existing sort for consistency (Latest Created First).
    // Sort by filter criteria: Priority to Today's Tasks, then by date
    const sortedRecords = [...records].sort((a, b) => {
        // Calculate today in local timezone
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const today = `${year}-${month}-${day}`

        const isUrgent = (r: CRMRecord) => {
            if (r.type === "protect") {
                const pr = r as any
                if (pr.paymentParts?.some((p: any) => p.date === today && !p.isReceived)) return true
                if (pr.skippedEmiDate === today) return true
                if (pr.nextFollowUpDate === today) return true
            } else if (r.type === "settlement") {
                const sr = r as any
                if (sr.paymentParts?.some((p: any) => p.date === today && !p.isReceived)) return true
                if (sr.nextFollowUpDate === today) return true
                if (sr.dueDate === today) return true
            }
            return false
        }

        const aUrgent = isUrgent(a)
        const bUrgent = isUrgent(b)

        if (aUrgent && !bUrgent) return -1
        if (!aUrgent && bUrgent) return 1

        // Secondary sort by date
        const dateA = new Date((a as any).nexusPurchaseDate || a.formFilledDate || a.uploadedAt).getTime()
        const dateB = new Date((b as any).nexusPurchaseDate || b.formFilledDate || b.uploadedAt).getTime()
        return dateB - dateA
    })

    const totalRecords = sortedRecords.length
    const startRecord = (currentPage - 1) * pageSize + 1
    const endRecord = Math.min(currentPage * pageSize, totalRecords)

    const paginatedRecords = sortedRecords.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const totalProtect = paginatedRecords.filter(r => r.type === "protect").length
    const totalSettlement = paginatedRecords.filter(r => r.type === "settlement").length

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Button
                    variant="link"
                    className="text-sm h-auto p-0"
                    onClick={() => setPageSize(prev => prev === 100 ? 10 : 100)}
                >
                    {pageSize === 100 ? "Show Less" : "View All"} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </div>

            <div className="border rounded-md bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Follow-up Details</TableHead>
                            <TableHead className="text-right w-[140px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                    No follow-ups scheduled for today.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedRecords.map((record) => (
                                <TableRow key={record.id} className="h-14">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full shrink-0",
                                                record.type === 'protect' ? "bg-blue-500" : "bg-orange-500"
                                            )} />
                                            <div className="flex flex-col">
                                                <div className="text-sm text-foreground font-medium">
                                                    {getTaskDescription(record)}
                                                </div>
                                                {(record as any).nextFollowUpDate && new Date((record as any).nextFollowUpDate) < new Date(new Date().setHours(0, 0, 0, 0)) && (
                                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> Overdue
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onView(record)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {/* Pagination & Footer */}
                        {totalRecords > 0 && (
                            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
                                <TableCell colSpan={2}>
                                    <div className="flex items-center justify-between px-2 w-full">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Showing {startRecord} to {endRecord} of {totalRecords}</span>
                                            <div className="flex items-center gap-2">
                                                <span>Rows per page:</span>
                                                <select
                                                    className="bg-transparent border rounded p-1"
                                                    value={pageSize}
                                                    onChange={(e) => {
                                                        setPageSize(Number(e.target.value))
                                                        setCurrentPage(1)
                                                    }}
                                                >
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={30}>30</option>
                                                    <option value={50}>50</option>
                                                    <option value={100}>100</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-2"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Prev
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-2"
                                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalRecords / pageSize), p + 1))}
                                                disabled={currentPage >= Math.ceil(totalRecords / pageSize)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
