"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { RecordDetailModal } from "@/components/record-detail-modal"
import { AddRecordModal } from "@/components/add-record-modal"
import { useCRMStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { CRMRecord } from "@/lib/types"
import { filterRecords } from "@/lib/filter-utils"
import { SettlementMetrics } from "@/components/settlement/settlement-metrics"

export default function SettlementPage() {
  const {
    records,
    setRecords,
    getSettlementRecords,
    deleteRecord,
    deleteRecords,
    updateRecord,
    isInitialized,
    setInitialized,
    hasHydrated,
  } = useCRMStore()

  // Local filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [partnerFilter, setPartnerFilter] = useState("all")
  const [lenderFilter, setLenderFilter] = useState("all")
  const [dpdFilter, setDpdFilter] = useState("all") // New state
  const [dateRangeStart, setDateRangeStart] = useState("")
  const [dateRangeEnd, setDateRangeEnd] = useState("")

  const [selectedRecord, setSelectedRecord] = useState<CRMRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const settlementRecords = getSettlementRecords()

  // Get unique lenders from settlement records
  const uniqueLenders = useMemo(() => {
    const lenders = settlementRecords.map(r => r.lenderName).filter(Boolean)
    return Array.from(new Set(lenders)).sort()
  }, [settlementRecords])

  const filteredRecords = useMemo(() => {
    return filterRecords(settlementRecords, {
      searchQuery,
      statusFilter,
      partnerFilter,
      lenderFilter, // Pass lender filter
      dpdFilter, // Pass DPD filter
      dateRangeStart,
      dateRangeEnd
    })
  }, [settlementRecords, searchQuery, statusFilter, partnerFilter, lenderFilter, dpdFilter, dateRangeStart, dateRangeEnd])

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
        <Header title="Settlement" subtitle="Manage settlement requests and loan negotiations" />

        <div className="p-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Record
            </Button>
          </div>

          <SettlementMetrics records={filteredRecords as any} />

          <DataTable
            title="Settlement Records"
            records={filteredRecords}
            type="settlement"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            partnerFilter={partnerFilter}
            setPartnerFilter={setPartnerFilter}
            lenderFilter={lenderFilter} // New prop
            setLenderFilter={setLenderFilter} // New prop
            dpdFilter={dpdFilter} // New prop
            setDpdFilter={setDpdFilter} // New prop
            uniqueLenders={uniqueLenders} // New prop
            dateRangeStart={dateRangeStart}
            dateRangeEnd={dateRangeEnd}
            setDateRange={handleSetDateRange}
            onViewRecord={handleViewRecord}
            onDeleteRecord={deleteRecord}
            onDeleteRecords={deleteRecords}
            onUpdateRecord={updateRecord}
            customStatusOptions={[
              { value: "No Action Taken", label: "No Action Taken" },
              { value: "Did Not Answered", label: "Did Not Answered" },
              { value: "Service Not Required and Closed", label: "Closed (NR)" },
              { value: "Settlement Initiated", label: "Settlement Initiated" },
              { value: "Settled", label: "Settled" },
            ]}
          />
        </div>
      </main>

      <RecordDetailModal recordId={selectedRecord?.id || null} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddRecordModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} defaultType="settlement" />
    </div>
  )
}
