"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CRMRecord, ProtectRecord, SettlementRecord, Status } from "@/lib/types"
import { ActionButtons } from "@/components/action-buttons"

interface DataTableRowProps {
    record: CRMRecord
    type: "protect" | "settlement" | "nexus"
    isSelected: boolean
    onSelect: (id: string) => void
    onView: (record: CRMRecord) => void
    onDelete: (id: string) => void
}

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

// Convert TableRow to a motion component
const MotionTableRow = motion(TableRow)

export const DataTableRow = memo(function DataTableRow({
    record,
    type,
    isSelected,
    onSelect,
    onView,
    onDelete
}: DataTableRowProps) {
    return (
        <MotionTableRow
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "hover:bg-muted/30 cursor-pointer group transition-colors duration-200",
                isSelected && "bg-muted/50"
            )}
            onClick={() => onView(record)}
        >
            <TableCell onClick={(e) => e.stopPropagation()} className="sticky left-0 bg-background z-10 border-r border-border/50 group-hover:bg-muted/30 transition-colors">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelect(record.id)}
                    aria-label={`Select ${record.name}`}
                />
            </TableCell>

            {type === "nexus" ? (
                <>
                    <TableCell className="text-xs font-mono whitespace-nowrap">
                        {(record as any).userId || "-"}
                    </TableCell>
                    <TableCell className="text-xs font-medium w-[150px] truncate group-hover:text-primary transition-colors" title={record.name}>{record.name}</TableCell>
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
                    <TableCell className="text-xs font-medium w-[150px] truncate group-hover:text-primary transition-colors" title={record.name}>{record.name}</TableCell>
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
                    <TableCell className="sticky right-0 bg-background z-10 border-l border-border/50 group-hover:bg-muted/30 transition-colors">
                        <ActionButtons
                            record={record}
                            onView={onView}
                            onDelete={onDelete}
                        />
                    </TableCell>
                </>
            ) : (
                <>
                    {/* Settlement Rows */}
                    <TableCell className="text-xs whitespace-nowrap">{(record as SettlementRecord).createdDate}</TableCell>
                    <TableCell className="text-xs font-medium w-[150px] truncate group-hover:text-primary transition-colors" title={record.name}>{record.name}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap font-mono truncate">{record.mobileNumber}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap truncate">{(record as SettlementRecord).debtType}</TableCell>
                    <TableCell className="text-xs w-[150px] truncate" title={(record as SettlementRecord).lenderName}>{(record as SettlementRecord).lenderName}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap font-mono truncate">{(record as SettlementRecord).creditCardNo}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap font-mono truncate">{(record as SettlementRecord).loanAccNo}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-right font-mono">₹{((record as SettlementRecord).loanAmount || 0).toLocaleString()}</TableCell>

                    <TableCell className="text-xs whitespace-nowrap">{(record as SettlementRecord).dueDate}</TableCell>
                    <TableCell className="text-center">
                        {(record as SettlementRecord).isEmiBounced ? <Badge variant="destructive" className="h-5 text-[10px]">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                    </TableCell>
                    <TableCell className="text-center">
                        {(record as SettlementRecord).isLegalNotice ? <Badge variant="destructive" className="h-5 text-[10px]">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-right font-mono">₹{(record as SettlementRecord).recommendedAmt.toLocaleString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-right font-mono">₹{(record as SettlementRecord).customerWishAmt.toLocaleString()}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-center font-mono">{(record as SettlementRecord).dpd}</TableCell>

                    <TableCell>
                        <Badge variant="outline" className={cn("text-xs whitespace-nowrap", statusStyles[record.status])}>
                            {statusLabels[record.status] || record.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap truncate" title={record.stage || "-"}>{record.stage || "-"}</TableCell>

                    <TableCell className="text-xs">
                        {(record as SettlementRecord).lenderContact || "-"}
                    </TableCell>

                    <TableCell className="text-xs">
                        {(record as SettlementRecord).fundsAvailable === true ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
                        ) : (record as SettlementRecord).fundsAvailable === false ? (
                            <span className="text-muted-foreground">No</span>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </TableCell>

                    <TableCell className="text-xs">
                        {(record as SettlementRecord).settlementOption || <span className="text-muted-foreground">-</span>}
                    </TableCell>

                    <TableCell className="text-xs">
                        {(record as SettlementRecord).emiMonths ? (
                            <Badge variant="secondary" className="font-mono text-[10px]">
                                {(record as SettlementRecord).emiMonths} EMIs
                            </Badge>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </TableCell>

                    <TableCell className="text-xs whitespace-pre-wrap break-words py-2" title={record.remarks?.length ? record.remarks[record.remarks.length - 1].text : "-"}>
                        {record.remarks?.length ? record.remarks[record.remarks.length - 1].text : "-"}
                    </TableCell>

                    <TableCell className="text-xs">
                        {(record as SettlementRecord).whatsappReachout === true ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
                        ) : (record as SettlementRecord).whatsappReachout === false ? (
                            <span className="text-muted-foreground">No</span>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </TableCell>

                    <TableCell className="sticky right-0 bg-background z-10 border-l border-border/50 group-hover:bg-muted/30 transition-colors">
                        <ActionButtons
                            record={record}
                            onView={onView}
                            onDelete={onDelete}
                        />
                    </TableCell>
                </>
            )}
        </MotionTableRow>
    )
})
