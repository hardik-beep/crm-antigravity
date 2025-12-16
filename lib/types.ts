export type Partner = "sayyam" | "snapmint" | "other"
export type RecordType = "protect" | "settlement" | "nexus"
export type Status = "new" | "in-progress" | "follow-up" | "closed" | "No Action Taken" | "Did Not Answered" | "Service Not Required and Closed" | "Rescue Started" | "Settlement Initiated" | "Settled"
export type DPDGroup = "0-30" | "31-60" | "61-90" | "91-180" | "180+" | "Unknown"

// Protect record type with all required columns
export interface ProtectRecord {
  id: string
  type: "protect"
  partner: Partner
  nexusPurchaseDate: string
  formFilledDate: string
  name: string
  mobileNumber: string
  panNumber: string
  plan: string
  institution: string
  accountNumber: string
  accountType: string
  dateOpened: string
  emiDate: string
  emiAmount: number
  lastPaymentDate?: string // New field for NPA calculation
  dpd: string
  currentDpd: string
  dpdGroup: string
  partPaymentAmount?: number
  paymentParts?: { id: string; amount: number; date: string; isReceived?: boolean }[]
  nextFollowUpDate?: string
  skippedEmiDate?: string
  status: Status
  stage: string
  uploadedFrom: string
  uploadedAt: string
  remarks: Remark[]
  activityLog: ActivityLogEntry[]
}

// Settlement record type with all required columns
export interface SettlementRecord {
  id: string
  type: "settlement"
  partner: Partner
  nexusPurchaseDate: string // Keeping for compat
  formFilledDate: string // Keeping for compat
  createdDate: string
  name: string
  mobileNumber: string
  serviceOpted: string // (deprecated in UI, but kept in type if needed, or remove if strictly cleaning up)
  debtType: string
  lenderName: string
  creditCardNo: string
  loanAccNo: string
  loanAmount: number // NEW: Mapped from "Loan Amount"
  dueAmt: number // Keeping for backward compat if needed, or map "Loan Amount" to this too?
  dueDate: string
  lastPaymentDate?: string
  isEmiBounced: boolean
  isLegalNotice: boolean
  currEmployment: string // (deprecated in UI?)
  otherDetails: string // (deprecated in UI?)
  recommendedAmt: number
  customerWishAmt: number
  dpd: string // NEW: Static from Excel

  // Manual / Editable Fields
  dpdRange: string // Keeping this ? User didn't List it in "Editable Fields".
  // User listed: Lender Contact, Funds, Settlement Mode, WhatsApp.
  // "Settlement record ke andar sirf neeche diye gaye options editable hone chahiye"
  // This implies DPD Range should be REMOVED from editable?
  // Or maybe "DPD" column from Excel replaces "DPD Range"?
  // User listed "DPD" in "Excel / Table Columns".
  // So likely DPD is now static. I will keep dpdRange for now but maybe hide it if not requested.
  lenderContact: string
  fundsAvailable: boolean | null
  settlementOption: "One Time" | "EMI" | null // Changed "One Shot" to "One Time" as per request
  emiMonths?: 2 | 3 | null // Changed 1,2,3 to 2,3 as per request
  whatsappReachout: boolean | null

  status: Status
  stage: string
  partPaymentAmount?: number
  paymentParts?: { id: string; amount: number; date: string; isReceived?: boolean }[]
  uploadedFrom: string
  uploadedAt: string
  remarks: Remark[]
  activityLog: ActivityLogEntry[]
}

// Nexus record type with specific columns
export interface NexusRecord {
  id: string
  type: "nexus"
  nexusPurchaseDate: string
  formFilledDate: string
  userId: string
  name: string
  mobileNumber: string
  email: string
  status: Status
  partner: Partner // Kept for compatibility, can be "other" or specific if needed
  stage: string
  uploadedFrom: string
  uploadedAt: string
  remarks: Remark[]
  activityLog: ActivityLogEntry[]
}

export type CRMRecord = ProtectRecord | SettlementRecord | NexusRecord

export interface Remark {
  id: string
  text: string
  createdAt: string
  updatedAt?: string
  createdBy: string
}

export interface ActivityLogEntry {
  id: string
  action: string
  details: string
  timestamp: string
  user: string
}

export interface UploadHistory {
  id: string
  fileName: string
  uploadedAt: string
  recordType: RecordType
  partner: Partner
  totalRows: number
  validRows: number
  invalidRows: number
}

export interface DashboardStats {
  totalRequests: number
  totalProtect: number
  totalSettlement: number
  sayyamProtect: number
  sayyamSettlement: number
  snapmintProtect: number
  snapmintSettlement: number
  dpdDistribution: { group: DPDGroup; count: number }[]
  dailyRequests: { date: string; count: number; protect: number; settlement: number }[]
  recentUploads: UploadHistory[]
  newRequestsToday: number
  newProtectToday: number
  newSettlementToday: number
  casesNPAToday: number
  totalNexus: number
  nexusFormFilled: number
  nexusFormNotFilled: number
}
