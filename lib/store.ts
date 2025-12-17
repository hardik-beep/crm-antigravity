"use client"

import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"
import { get, set, del } from "idb-keyval"
import type {
  CRMRecord,
  ProtectRecord,
  SettlementRecord,
  NexusRecord,
  UploadHistory,
  Remark,
  ActivityLogEntry,
  Status,
  DPDGroup,
  Partner,
} from "./types"

// Custom Storage Adapter for IndexedDB
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

interface CRMStore {
  records: CRMRecord[]
  uploadHistory: UploadHistory[]

  // Filters
  searchQuery: string
  statusFilter: string
  partnerFilter: string
  lenderFilter: string
  dpdGroupFilter: string
  dateRangeStart: string
  dateRangeEnd: string
  typeFilter: "protect" | "settlement" | "nexus" | "both"
  dateFilterType: "total" | "today" | "7d" | "30d" | "1y" | "custom"
  npaOnly: boolean
  isInitialized: boolean
  geminiApiKey: string

  // Actions
  // Actions
  setInitialized: (val: boolean) => void
  setGeminiApiKey: (key: string) => void
  setRecords: (records: CRMRecord[]) => void
  fetchRecords: () => Promise<void>
  fetchUploadHistory: () => Promise<void>
  addRecords: (records: CRMRecord[], upload: UploadHistory) => Promise<void>
  updateRecord: (id: string, updates: Partial<CRMRecord>) => Promise<void>
  updateRecordStatus: (id: string, status: Status) => Promise<void>
  updateRecordStage: (id: string, stage: string) => Promise<void>
  updatePartPayment: (id: string, amount: number) => Promise<void>
  addRemark: (recordId: string, remark: Omit<Remark, "id">) => Promise<void>
  updateRemark: (recordId: string, remarkId: string, text: string) => Promise<void>
  deleteRemark: (recordId: string, remarkId: string) => Promise<void>
  addActivityLog: (recordId: string, entry: Omit<ActivityLogEntry, "id">) => Promise<void>
  deleteActivityLog: (recordId: string, logId: string) => Promise<void>
  deleteRecord: (id: string) => Promise<void>
  deleteRecords: (ids: string[]) => Promise<void>


  // Filter setters
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setPartnerFilter: (partner: string) => void
  setLenderFilter: (lender: string) => void
  setDpdGroupFilter: (group: string) => void
  setDateRange: (start: string, end: string) => void
  setTypeFilter: (type: "protect" | "settlement" | "nexus" | "both") => void
  setDateFilterType: (type: "total" | "today" | "7d" | "30d" | "1y" | "custom") => void
  setNpaOnly: (val: boolean) => void

  // Getters
  getProtectRecords: () => ProtectRecord[]
  getSettlementRecords: () => SettlementRecord[]
  getNexusRecords: () => NexusRecord[]
  getFilteredProtectRecords: () => ProtectRecord[]
  getFilteredSettlementRecords: () => SettlementRecord[]
  getFilteredRecords: () => CRMRecord[]
  getRecordById: (id: string) => CRMRecord | undefined

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

// Helper to determine DPD Group
export function getDPDGroup(dpd: number): DPDGroup {
  if (dpd <= 30) return "0-30"
  if (dpd <= 60) return "31-60"
  if (dpd <= 90) return "61-90"
  if (dpd <= 180) return "91-180"
  return "180+"
}

// Helper to detect partner from data
export function detectPartner(row: Record<string, unknown>): Partner | null {
  const values = Object.values(row).map((v) => String(v).toLowerCase().trim())

  if (values.some((v) => v.includes("sayyam") || v.includes("sayam") || v === "sy")) return "sayyam"
  if (values.some((v) => v.includes("snapmint") || v.includes("snap mint") || v === "sm")) return "snapmint"

  return null
}

// Helper to detect record type from columns
export function detectRecordType(columns: string[]): "protect" | "settlement" | "nexus" {
  const lowerCols = columns.map((c) => c.toLowerCase().trim())

  // Unique columns for Nexus
  const nexusIndicators = [
    "user id", "user_id",
    "nexus purchase date", "tx_date_time", "tx date time"
  ]

  // Unique columns for Settlement
  const settlementIndicators = [
    "creditor name",
    "debt type",
    "loan amount",
    "is emi bounced",
    "customer wish amount",
    "recommended amount"
  ]

  // Unique columns for Protect
  const protectIndicators = [
    "plan",
    "institution",
    "account number",
    "emi amount",
    "current dpd"
  ]

  const hasNexus = (
    lowerCols.some(c => c.includes("user_id") || c.includes("user id")) ||
    lowerCols.some(c => c.includes("tx_date_time")) ||
    (lowerCols.some(c => c.includes("user_id")) && lowerCols.some(c => c.includes("email")))
  )

  const hasSettlement = settlementIndicators.some(ind => lowerCols.some(col => col.includes(ind)))
  const hasProtect = protectIndicators.some(ind => lowerCols.some(col => col.includes(ind)))

  if (hasNexus) return "nexus"

  // Prefer Settlement if strong indicators exist
  if (hasSettlement) return "settlement"
  if (hasProtect) return "protect"

  // Fallback or default
  return "protect"
}

export const useCRMStore = create<CRMStore>()(
  persist(
    (set, get) => ({
      records: [],
      uploadHistory: [],
      searchQuery: "",
      statusFilter: "all",
      partnerFilter: "all",
      lenderFilter: "all",
      dpdGroupFilter: "all",
      dateRangeStart: "",
      dateRangeEnd: "",
      typeFilter: "both",
      dateFilterType: "30d",
      npaOnly: false,
      isInitialized: false,
      geminiApiKey: "",

      setInitialized: (val) => set({ isInitialized: val }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setRecords: (records) => set({ records }),

      fetchRecords: async () => {
        try {
          const res = await fetch('/api/records');
          const data = await res.json();
          if (data.records) {
            set({ records: data.records });
          }
        } catch (error) {
          console.error("Failed to fetch records:", error);
        }
      },

      fetchUploadHistory: async () => {
        try {
          const res = await fetch('/api/upload-history');
          const data = await res.json();
          if (data.history) {
            set({ uploadHistory: data.history });
          }
        } catch (error) {
          console.error("Failed to fetch upload history:", error);
        }
      },

      addRecords: async (newRecords, upload) => {
        // Optimistic update? No, let's wait for server for bulk add to ensure ID stability if server generated IDs (but here we generate IDs in client possibly? yes, in excel-upload).
        // Actually excel-upload generates IDs.
        // Optimistic:
        set((state) => ({
          records: [...state.records, ...newRecords],
          uploadHistory: [upload, ...state.uploadHistory],
        }));

        // Sync
        try {
          await fetch('/api/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ records: newRecords })
          });
          await fetch('/api/upload-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(upload)
          });
        } catch (e) { console.error("Sync failed", e) }
      },

      updateRecord: async (id, updates) => {
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, ...updates } as CRMRecord : r)),
        }));
        try {
          await fetch(`/api/records/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
        } catch (e) { console.error("Sync failed", e) }
      },

      updateRecordStatus: async (id, status) => {
        const record = get().records.find((r) => r.id === id)
        if (record) {
          const entry: Omit<ActivityLogEntry, "id"> = {
            action: "Status Changed",
            details: `Status updated to "${status}"`,
            timestamp: new Date().toISOString(),
            user: "Current User",
          }
          const updatedRecord = { ...record, status, activityLog: [...record.activityLog, { ...entry, id: `log-${Date.now()}` }] } as CRMRecord;

          set((state) => ({
            records: state.records.map((r) => r.id === id ? updatedRecord : r),
          }));

          try {
            await fetch(`/api/records/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      updateRecordStage: async (id, stage) => {
        const record = get().records.find((r) => r.id === id)
        if (record) {
          const entry: Omit<ActivityLogEntry, "id"> = {
            action: "Stage Changed",
            details: `Stage updated to "${stage}"`,
            timestamp: new Date().toISOString(),
            user: "Current User",
          }
          const updatedRecord = { ...record, stage, activityLog: [...record.activityLog, { ...entry, id: `log-${Date.now()}` }] } as CRMRecord;

          set((state) => ({
            records: state.records.map((r) => r.id === id ? updatedRecord : r),
          }));

          try {
            await fetch(`/api/records/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      updatePartPayment: async (id, amount) => {
        const record = get().records.find((r) => r.id === id)
        if (record) {
          const entry: Omit<ActivityLogEntry, "id"> = {
            action: "Part Payment Updated",
            details: `Part Payment updated to ₹${amount.toLocaleString()}`,
            timestamp: new Date().toISOString(),
            user: "Current User",
          }
          const updatedRecord = { ...record, partPaymentAmount: amount, activityLog: [...record.activityLog, { ...entry, id: `log-${Date.now()}` }] } as CRMRecord;

          set((state) => ({
            records: state.records.map((r) => r.id === id ? updatedRecord : r),
          }));

          try {
            await fetch(`/api/records/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      addRemark: async (recordId, remark) => {
        const record = get().records.find((r) => r.id === recordId);
        if (record) {
          const newRemark = { ...remark, id: `remark-${Date.now()}` };
          const logEntry = {
            id: `log-${Date.now()}`,
            action: "Remark Added",
            details: remark.text.substring(0, 50) + (remark.text.length > 50 ? "..." : ""),
            timestamp: new Date().toISOString(),
            user: remark.createdBy,
          };
          const updatedRecord = {
            ...record,
            remarks: [...record.remarks, newRemark],
            activityLog: [...record.activityLog, logEntry]
          } as CRMRecord;

          set((state) => ({
            records: state.records.map((r) => r.id === recordId ? updatedRecord : r)
          }));

          try {
            await fetch(`/api/records/${recordId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      updateRemark: async (recordId, remarkId, text) => {
        const record = get().records.find((r) => r.id === recordId);
        if (record) {
          const updatedRecord = {
            ...record,
            remarks: record.remarks.map((rem) =>
              rem.id === remarkId ? { ...rem, text, updatedAt: new Date().toISOString() } : rem,
            ),
          } as CRMRecord;

          set((state) => ({
            records: state.records.map((r) => r.id === recordId ? updatedRecord : r)
          }));

          try {
            await fetch(`/api/records/${recordId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      deleteRemark: async (recordId, remarkId) => {
        const record = get().records.find((r) => r.id === recordId);
        if (record) {
          const updatedRecord = { ...record, remarks: record.remarks.filter((rem) => rem.id !== remarkId) } as CRMRecord;
          set((state) => ({
            records: state.records.map((r) => r.id === recordId ? updatedRecord : r),
          }));

          try {
            await fetch(`/api/records/${recordId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      deleteRecord: async (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
        try {
          await fetch(`/api/records/${id}`, {
            method: 'DELETE'
          });
        } catch (e) { console.error("Sync failed", e) }
      },

      deleteRecords: async (ids) => {
        console.log("store.deleteRecords called with ids:", ids)
        set((state) => {
          const newRecords = state.records.filter((r) => !ids.includes(r.id))
          console.log("Records before:", state.records.length, "Records after:", newRecords.length)
          return { records: newRecords }
        })
        try {
          await fetch(`/api/records/bulk-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
          });
        } catch (e) { console.error("Sync failed", e) }
      },


      addActivityLog: async (recordId, entry) => {
        const record = get().records.find((r) => r.id === recordId);
        if (record) {
          const updatedRecord = { ...record, activityLog: [...record.activityLog, { ...entry, id: `log-${Date.now()}` }] } as CRMRecord;
          set((state) => ({
            records: state.records.map((r) => r.id === recordId ? updatedRecord : r)
          }));
          try {
            await fetch(`/api/records/${recordId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      deleteActivityLog: async (recordId, logId) => {
        const record = get().records.find((r) => r.id === recordId);
        if (record) {
          const updatedRecord = { ...record, activityLog: record.activityLog.filter((log) => log.id !== logId) } as CRMRecord;
          set((state) => ({
            records: state.records.map((r) => r.id === recordId ? updatedRecord : r)
          }));
          try {
            await fetch(`/api/records/${recordId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedRecord)
            });
          } catch (e) { console.error("Sync failed", e) }
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setPartnerFilter: (partner) => set({ partnerFilter: partner }),
      setLenderFilter: (lender) => set({ lenderFilter: lender }),
      setDpdGroupFilter: (group) => set({ dpdGroupFilter: group }),
      setDateRange: (start, end) => set({ dateRangeStart: start, dateRangeEnd: end }),
      setTypeFilter: (type) => set({ typeFilter: type }),
      setDateFilterType: (type) => set({ dateFilterType: type }),
      setNpaOnly: (val) => set({ npaOnly: val }),

      getProtectRecords: () => get().records.filter((r): r is ProtectRecord => r.type === "protect"),
      getSettlementRecords: () => get().records.filter((r): r is SettlementRecord => r.type === "settlement"),
      getNexusRecords: () => get().records.filter((r): r is NexusRecord => r.type === "nexus"),

      getFilteredProtectRecords: () => {
        const { records, searchQuery, statusFilter, partnerFilter, dpdGroupFilter, dateRangeStart, dateRangeEnd } =
          get()
        return records
          .filter((r): r is ProtectRecord => r.type === "protect")
          .filter((r) => {
            const matchesSearch =
              searchQuery === "" ||
              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.mobileNumber.includes(searchQuery) ||
              r.accountNumber.includes(searchQuery)

            // Custom Stage Filtering for Protect Page
            let matchesStatus = true
            if (statusFilter !== "all") {
              if (statusFilter === "Part Payment" || statusFilter === "Skip EMI") {
                // Filter by Stage
                matchesStatus = r.stage === statusFilter
              } else {
                // Filter by Status (standard)
                matchesStatus = r.status === statusFilter
              }
            }
            const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter
            const matchesLender = get().lenderFilter === "all" || r.institution === get().lenderFilter
            const matchesDpd = dpdGroupFilter === "all" || r.dpdGroup === dpdGroupFilter

            let matchesDate = true
            if (dateRangeStart && dateRangeEnd) {
              const dateStr = r.nexusPurchaseDate || r.formFilledDate
              const recordDate = new Date(dateStr)
              const start = new Date(dateRangeStart)
              start.setHours(0, 0, 0, 0)

              const end = new Date(dateRangeEnd)
              end.setHours(23, 59, 59, 999)

              matchesDate = recordDate >= start && recordDate <= end
            }

            return matchesSearch && matchesStatus && matchesPartner && matchesLender && matchesDpd && matchesDate
          })
          .sort((a, b) => new Date(b.formFilledDate).getTime() - new Date(a.formFilledDate).getTime())
      },

      getFilteredSettlementRecords: () => {
        const { records, searchQuery, statusFilter, partnerFilter, dateRangeStart, dateRangeEnd } = get()
        return records
          .filter((r): r is SettlementRecord => r.type === "settlement")
          .filter((r) => {
            const matchesSearch =
              searchQuery === "" ||
              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.mobileNumber.includes(searchQuery) ||
              r.loanAccNo.includes(searchQuery)
            const matchesStatus = statusFilter === "all" || r.status === statusFilter
            const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter
            const matchesLender = get().lenderFilter === "all" || r.lenderName === get().lenderFilter

            let matchesDate = true
            if (dateRangeStart && dateRangeEnd) {
              const dateStr = r.createdDate || r.nexusPurchaseDate || r.formFilledDate
              const recordDate = new Date(dateStr)
              const start = new Date(dateRangeStart)
              start.setHours(0, 0, 0, 0)

              const end = new Date(dateRangeEnd)
              end.setHours(23, 59, 59, 999)

              matchesDate = recordDate >= start && recordDate <= end
            }

            return matchesSearch && matchesStatus && matchesPartner && matchesLender && matchesDate
          })
          .sort((a, b) => new Date(b.createdDate || b.formFilledDate).getTime() - new Date(a.createdDate || a.formFilledDate).getTime())
      },

      getFilteredRecords: () => {
        const { records, searchQuery, statusFilter, partnerFilter, lenderFilter, dpdGroupFilter, dateRangeStart, dateRangeEnd, typeFilter, npaOnly } = get()

        return records.filter((r) => {
          // Type Filter
          if (typeFilter !== "both" && r.type !== typeFilter) return false

          // Search Filter
          let matchesSearch = false
          if (r.type === "protect") {
            const pr = r as ProtectRecord
            matchesSearch = searchQuery === "" ||
              pr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              pr.mobileNumber.includes(searchQuery) ||
              pr.accountNumber.includes(searchQuery)
          } else if (r.type === "settlement") {
            const sr = r as SettlementRecord
            matchesSearch = searchQuery === "" ||
              sr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sr.mobileNumber.includes(searchQuery) ||
              sr.loanAccNo.includes(searchQuery)
          } else if (r.type === "nexus") {
            const nr = r as NexusRecord
            matchesSearch = searchQuery === "" ||
              nr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              nr.mobileNumber.includes(searchQuery) ||
              nr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              nr.userId.toLowerCase().includes(searchQuery.toLowerCase())
          }

          // Common Filters
          const matchesStatus = statusFilter === "all" || r.status === statusFilter
          // Nexus records might not have partner logic fully fleshed out but we keep it for now
          const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter

          // Lender Filter
          let matchesLender = true
          if (lenderFilter !== "all") {
            if (r.type === "protect") {
              matchesLender = (r as ProtectRecord).institution === lenderFilter
            } else if (r.type === "settlement") {
              matchesLender = (r as SettlementRecord).lenderName === lenderFilter
            } else {
              // For Nexus or others, assume no match if a lender filter is active
              matchesLender = false
            }
          }

          // DPD Filter (only for protect)
          const matchesDpd = r.type === "protect" ? (dpdGroupFilter === "all" || (r as ProtectRecord).dpdGroup === dpdGroupFilter) : true

          let matchesDate = true
          if (dateRangeStart && dateRangeEnd) {
            let dateStr = ""
            if (r.type === "settlement") {
              dateStr = (r as SettlementRecord).createdDate
            } else {
              dateStr = r.nexusPurchaseDate || r.formFilledDate
            }

            // Fallback for any record if empty
            if (!dateStr) dateStr = r.nexusPurchaseDate || r.formFilledDate || (r as any).createdDate

            const recordDate = new Date(dateStr)
            const start = new Date(dateRangeStart)
            start.setHours(0, 0, 0, 0)

            const end = new Date(dateRangeEnd)
            end.setHours(23, 59, 59, 999)

            // If date is invalid, it won't match range usually.
            if (!isNaN(recordDate.getTime())) {
              matchesDate = recordDate >= start && recordDate <= end
            } else {
              matchesDate = false
            }
          }

          // NPA Filter
          let matchesNpa = true
          if (npaOnly) {
            if (r.type === "nexus") return false // Nexus records don't have NPA logic yet

            const todayDate = new Date()
            todayDate.setHours(0, 0, 0, 0)
            const todayStr = todayDate.toISOString().split("T")[0]

            // Safe cast because we checked type is not nexus
            let referenceDateStr = (r as ProtectRecord | SettlementRecord).lastPaymentDate

            const isDefaultOrMissing = !referenceDateStr || referenceDateStr === todayStr

            if (isDefaultOrMissing) {
              if (r.type === "protect" && (r as ProtectRecord).emiDate && (r as ProtectRecord).emiDate !== todayStr) {
                referenceDateStr = (r as ProtectRecord).emiDate
              } else if (r.type === "settlement" && (r as SettlementRecord).dueDate && (r as SettlementRecord).dueDate !== todayStr) {
                referenceDateStr = (r as SettlementRecord).dueDate
              }
            }

            if (referenceDateStr) {
              const refDate = new Date(referenceDateStr)
              if (!isNaN(refDate.getTime())) {
                refDate.setHours(0, 0, 0, 0)
                const diffTime = todayDate.getTime() - refDate.getTime()
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                matchesNpa = diffDays >= 90
              } else {
                matchesNpa = false
              }
            } else {
              matchesNpa = false
            }
          }

          return matchesSearch && matchesStatus && matchesPartner && matchesLender && matchesDpd && matchesDate && matchesNpa
        })
      },

      getRecordById: (id) => get().records.find((r) => r.id === id),

      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: "crm-storage-indexeddb",
      storage: createJSONStorage(() => storage),
      partialize: (state) => {
        // Persist all state including records and uploadHistory to fix "zero data" on refresh
        return state;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        // Fetch records on hydration (or maybe call it explicitly in app)
        // Better to call it in app/layout to control timing and auth, but here works for "on load".
        // However, we can't await here easily.
      },
    },
  ),
)
