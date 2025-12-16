"use client"

import { useState, useEffect, useMemo } from "react"
import { ShoppingBag, FileText, FileX } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { RecordDetailModal } from "@/components/record-detail-modal"
import { useCRMStore } from "@/lib/store"
import { sampleProtectRecords, sampleSettlementRecords, sampleNexusRecords } from "@/lib/sample-data"
import type { CRMRecord } from "@/lib/types"
import { filterRecords } from "@/lib/filter-utils"

export default function NexusPurchasedPage() {
    const {
        records,
        setRecords,
        deleteRecord,
        deleteRecords,
        isInitialized,
        setInitialized,
        hasHydrated,
    } = useCRMStore()

    // Local filter state
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [partnerFilter, setPartnerFilter] = useState("all")
    const [dateRangeStart, setDateRangeStart] = useState("")
    const [dateRangeEnd, setDateRangeEnd] = useState("")

    const [selectedRecord, setSelectedRecord] = useState<CRMRecord | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Use Nexus records
    // Use Nexus records
    const nexusRecords = useMemo(() => records.filter(r => r.type === "nexus"), [records])

    const filteredRecords = useMemo(() => {
        return filterRecords(nexusRecords, {
            searchQuery,
            statusFilter,
            partnerFilter,
            dateRangeStart,
            dateRangeEnd
        })
    }, [nexusRecords, searchQuery, statusFilter, partnerFilter, dateRangeStart, dateRangeEnd])

    const handleViewRecord = (record: CRMRecord) => {
        setSelectedRecord(record)
        setIsModalOpen(true)
    }

    const handleSetDateRange = (start: string, end: string) => {
        setDateRangeStart(start)
        setDateRangeEnd(end)
    }

    if (!isClient) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="ml-64">
                <Header title="Nexus Purchased" subtitle="View all Nexus purchased records" />

                <div className="p-6">
                    {/* Nexus Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Purchased</p>
                                <h3 className="text-2xl font-bold mt-1 text-primary">{filteredRecords.length}</h3>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-full">
                                <ShoppingBag className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Request Raised</p>
                                <h3 className="text-2xl font-bold mt-1 text-green-600">{filteredRecords.filter(r => r.formFilledDate).length}</h3>
                            </div>
                            <div className="p-2 bg-green-500/10 rounded-full">
                                <FileText className="h-4 w-4 text-green-600" />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Not Raised</p>
                                <h3 className="text-2xl font-bold mt-1 text-orange-600">{filteredRecords.filter(r => !r.formFilledDate).length}</h3>
                            </div>
                            <div className="p-2 bg-orange-500/10 rounded-full">
                                <FileX className="h-4 w-4 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        title="Nexus Purchased Records"
                        records={filteredRecords}
                        type="nexus"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        customStatusOptions={[
                            { value: "request-raised-yes", label: "Request Raised: Yes" },
                            { value: "request-raised-no", label: "Request Raised: No" }
                        ]}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        // Partner filter removed
                        partnerFilter="all"
                        setPartnerFilter={() => { }}
                        dateRangeStart={dateRangeStart}
                        dateRangeEnd={dateRangeEnd}
                        setDateRange={handleSetDateRange}
                        onViewRecord={handleViewRecord}
                        onDeleteRecord={deleteRecord}
                        onDeleteRecords={deleteRecords}
                    />
                </div>
            </main>

            <RecordDetailModal recordId={selectedRecord?.id || null} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
