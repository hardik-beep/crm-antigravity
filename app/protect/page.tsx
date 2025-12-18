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
import { ProtectMetrics } from "@/components/protect/protect-metrics"

export default function ProtectPage() {
  const {
    records,
    setRecords,
    getProtectRecords,
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
  const [lenderFilter, setLenderFilter] = useState("all") // Local lender filter
  const [dateRangeStart, setDateRangeStart] = useState("")
  const [dateRangeEnd, setDateRangeEnd] = useState("")

  const [stageFilter, setStageFilter] = useState("all")
  const [paymentDueToday, setPaymentDueToday] = useState(false)
  const [partPaymentFilter, setPartPaymentFilter] = useState("all")

  const [selectedRecord, setSelectedRecord] = useState<CRMRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const protectRecords = getProtectRecords()

  // Extract unique institutions for filter
  const uniqueLenders = useMemo(() => {
    const lenders = new Set(protectRecords.map(r => r.institution).filter(Boolean))
    return Array.from(lenders).sort()
  }, [protectRecords])

  const filteredRecords = useMemo(() => {
    // DEBUG LOGGING
    if (dateRangeStart || dateRangeEnd) {
      console.log("Filtering with Date Range:", dateRangeStart, "to", dateRangeEnd)
      console.log("Total Protect Records:", protectRecords.length)
      if (protectRecords.length > 0) {
        console.log("First record date:", protectRecords[0].formFilledDate)
        console.log("Sample dates:", protectRecords.slice(0, 5).map(r => r.formFilledDate))
      }
    }

    const result = filterRecords(protectRecords, {
      searchQuery,
      statusFilter,
      partnerFilter, // Note: Filter logic in store still uses partnerFilter, but UI might hide it if we replace.
      // Wait, passing lenderFilter to DataTable replaces the Partner UI dropdown.
      // But filterRecords ALSO needs to know about lenderFilter if it's not being handled by store's getFilteredRecords?
      // Actually, protectRecords is `getProtectRecords()` which returns ALL records.
      // So `filterRecords` needs to handle lender filtering too.
      // Let's check `lib/filter-utils.ts`... wait I can't view it right now.
      // But I can trust `useCRMStore`'s `getFilteredProtectRecords` OR I can add logic here.
      // The `filteredRecords` seems to be CLIENT-SIDE filtering here in this file based on local states?
      // Yes `const [searchQuery, setSearchQuery] = useState("")`.
      // So I need to pass `lenderFilter` to `filterRecords` or filter strictly here.
      // Looking at `filterRecords` usage: `filterRecords(protectRecords, { ... })`.
      // `lenderFilter` from store is global?
      // `useCRMStore` has `lenderFilter` and `setLenderFilter`.
      // If I use the store's `lenderFilter`, then `filterRecords` utility usually isn't aware of it unless I pass it.

      // I will add lenderFilter to the object passed to filterRecords.
      lenderFilter: lenderFilter === "all" ? undefined : lenderFilter,
      dateRangeStart,
      dateRangeEnd,
      partPaymentFilter,
      stageFilter,
      paymentDueToday
    })

    if (dateRangeStart || dateRangeEnd) {
      console.log("Records passing date filter (and other filters):", result.length)
    }

    // Sort by Created Date (formFilledDate) descending
    return result.sort((a, b) => {
      const dateA = new Date((a as any).formFilledDate || 0).getTime()
      const dateB = new Date((b as any).formFilledDate || 0).getTime()
      return dateB - dateA
    })
  }, [protectRecords, searchQuery, statusFilter, stageFilter, partnerFilter, dateRangeStart, dateRangeEnd, partPaymentFilter, lenderFilter, paymentDueToday])

  const handleViewRecord = (record: CRMRecord) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const handleSetDateRange = (start: string, end: string) => {
    setDateRangeStart(start)
    setDateRangeEnd(end)
  }

  const handleStatusClick = (status: string) => {
    setStatusFilter(prev => prev === status ? "all" : status)
    setStageFilter("all")
    setPaymentDueToday(false)
  }

  const handleStageClick = (stage: string) => {
    setStageFilter(prev => prev === stage ? "all" : stage)
    setStatusFilter("all")
    setPaymentDueToday(false)
  }

  const handlePartPaymentClick = () => {
    setPaymentDueToday(prev => !prev)
    setStatusFilter("all")
    setStageFilter("all")
  }

  const handleTotalClick = () => {
    setStatusFilter("all")
    setStageFilter("all")
    setPaymentDueToday(false)
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
        <Header title="Protect" subtitle="Manage protect requests and EMI protection cases" />

        <div className="p-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Record
            </Button>
          </div>

          <ProtectMetrics
            records={filteredRecords as any}
            onStatusClick={handleStatusClick}
            onStageClick={handleStageClick}
            onPartPaymentClick={handlePartPaymentClick}
            onTotalClick={handleTotalClick}
            activeStatus={statusFilter !== "all" ? statusFilter : undefined}
            activeStage={stageFilter !== "all" ? stageFilter : undefined}
            isPartPaymentActive={paymentDueToday}
          />

          <DataTable
            title="Protect Records"
            records={filteredRecords}
            type="protect"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            partnerFilter={partnerFilter}
            setPartnerFilter={setPartnerFilter}
            dateRangeStart={dateRangeStart}
            dateRangeEnd={dateRangeEnd}
            setDateRange={handleSetDateRange}
            partPaymentFilter={partPaymentFilter}
            setPartPaymentFilter={setPartPaymentFilter}
            uniqueLenders={uniqueLenders}
            lenderFilter={lenderFilter}
            setLenderFilter={setLenderFilter}
            onViewRecord={handleViewRecord}
            onDeleteRecord={deleteRecord}
            onDeleteRecords={deleteRecords}
            customStatusOptions={[
              { value: "Part Payment", label: "Part Payment" },
              { value: "Skip EMI", label: "Skip EMI" },
            ]}
          />
        </div>
      </main>

      <RecordDetailModal recordId={selectedRecord?.id || null} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddRecordModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} defaultType="protect" />
    </div>
  )
}
