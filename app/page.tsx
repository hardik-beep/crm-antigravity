"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MetricsRow } from "@/components/dashboard/metrics-row"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { RecentActivityTable } from "@/components/dashboard/recent-activity-table"
import { RecordDetailModal } from "@/components/record-detail-modal"
import { useCRMStore } from "@/lib/store"
import { sampleProtectRecords, sampleSettlementRecords, calculateDashboardStats } from "@/lib/sample-data"
import type { CRMRecord } from "@/lib/types"

export default function DashboardPage() {
  const {
    records,
    uploadHistory,
    setRecords,
    getFilteredRecords,
    isInitialized,
    setInitialized,
    hasHydrated,
    npaOnly,
    setNpaOnly,
    typeFilter
  } = useCRMStore()
  const [isClient, setIsClient] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<CRMRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Initialize with sample data if empty
  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredRecords = getFilteredRecords()
  const stats = calculateDashboardStats(filteredRecords, uploadHistory)
  console.log("Dashboard stats:", stats, "Filtered records:", filteredRecords.length)


  // Calculate today in local timezone (YYYY-MM-DD)
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const today = `${year}-${month}-${day}`

  const todayFollowUps = filteredRecords.filter(record => {
    if (record.type === "protect") {
      const r = record as any
      // Check part payments
      const hasPartPaymentDue = r.paymentParts?.some((p: any) => p.date === today && !p.isReceived)
      // Check skipped EMI (ensure generic text match if formats vary, but assume YYYY-MM-DD)
      const hasSkippedEmiDue = r.skippedEmiDate === today
      // Check follow up
      const hasFollowUp = r.nextFollowUpDate === today

      return hasPartPaymentDue || hasSkippedEmiDue || hasFollowUp
    } else if (record.type === "settlement") {
      const r = record as any
      // Check part payments
      const hasPartPaymentDue = r.paymentParts?.some((p: any) => p.date === today && !p.isReceived)
      // Check manually set follow-up date
      const hasFollowUp = r.nextFollowUpDate === today
      return hasPartPaymentDue || hasFollowUp
    }
    return false
  })

  const handleViewRecord = (record: CRMRecord) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const handleNpaClick = () => {
    setNpaOnly(!npaOnly)
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
        <Header title="Dashboard" subtitle="Overview of your loan settlement operations" />

        <div className="p-6 space-y-8">
          {/* Filters */}
          <section>
            <FilterBar />
          </section>

          {/* Metrics */}
          <section>
            <MetricsRow
              stats={stats}
              onNpaClick={handleNpaClick}
              isNpaFilterActive={npaOnly}
              hideNpa={typeFilter !== "both"}
              hideSettlement={typeFilter === "protect"}
              hideProtect={typeFilter === "settlement"}
              requestsTitle={typeFilter === "protect" ? "All Protect Requests" : typeFilter === "settlement" ? "All Settlement Requests" : "All Requests"}
            />
          </section>

          {/* Today's Follow-ups */}
          <section>
            <RecentActivityTable
              records={todayFollowUps}
              onView={handleViewRecord}
              title="Today's Follow-ups"
            />
          </section>
        </div>
      </main>

      <RecordDetailModal recordId={selectedRecord?.id || null} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
