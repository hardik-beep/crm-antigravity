import type { ProtectRecord, SettlementRecord, NexusRecord, DashboardStats, UploadHistory, CRMRecord } from "./types"

// Sample Protect Records
export const sampleProtectRecords: ProtectRecord[] = [
  {
    id: "p1",
    type: "protect",
    partner: "sayyam",
    nexusPurchaseDate: "2024-10-15",
    formFilledDate: "2024-10-20",
    name: "Rahul Sharma",
    mobileNumber: "9876543210",
    panNumber: "ABCDE1234F",
    plan: "Premium",
    institution: "HDFC Bank",
    accountNumber: "XXXX1234",
    accountType: "Savings",
    dateOpened: "2022-05-10",
    emiDate: "2024-11-05",
    emiAmount: 15000,
    dpd: "45",
    currentDpd: "52",
    dpdGroup: "31-60",
    status: "in-progress",
    stage: "Documentation",
    uploadedFrom: "batch_oct_2024.xlsx",
    uploadedAt: "2024-10-20T10:30:00Z",
    remarks: [
      {
        id: "r1",
        text: "Customer contacted, willing to settle",
        createdAt: "2024-10-25T14:00:00Z",
        createdBy: "Admin",
      },
    ],
    activityLog: [
      {
        id: "a1",
        action: "Record Created",
        details: "Imported from batch_oct_2024.xlsx",
        timestamp: "2024-10-20T10:30:00Z",
        user: "System",
      },
    ],
  },
  {
    id: "p2",
    type: "protect",
    partner: "snapmint",
    nexusPurchaseDate: "2024-09-22",
    formFilledDate: "2024-09-25",
    name: "Priya Patel",
    mobileNumber: "9988776655",
    panNumber: "FGHIJ5678K",
    plan: "Basic",
    institution: "ICICI Bank",
    accountNumber: "XXXX5678",
    accountType: "Current",
    dateOpened: "2021-03-15",
    emiDate: "2024-10-10",
    emiAmount: 8500,
    dpd: "25",
    currentDpd: "28",
    dpdGroup: "0-30",
    status: "new",
    stage: "Initial Review",
    uploadedFrom: "sept_batch.csv",
    uploadedAt: "2024-09-25T09:15:00Z",
    remarks: [],
    activityLog: [
      {
        id: "a2",
        action: "Record Created",
        details: "Imported from sept_batch.csv",
        timestamp: "2024-09-25T09:15:00Z",
        user: "System",
      },
    ],
  },
  {
    id: "p3",
    type: "protect",
    partner: "sayyam",
    nexusPurchaseDate: "2024-08-10",
    formFilledDate: "2024-08-15",
    name: "Amit Kumar",
    mobileNumber: "9123456780",
    panNumber: "KLMNO9012P",
    plan: "Gold",
    institution: "Axis Bank",
    accountNumber: "XXXX9012",
    accountType: "Savings",
    dateOpened: "2020-11-20",
    emiDate: "2024-09-01",
    emiAmount: 22000,
    dpd: "95",
    currentDpd: "102",
    dpdGroup: "91-180",
    status: "follow-up",
    stage: "Negotiation",
    uploadedFrom: "aug_data.xlsx",
    uploadedAt: "2024-08-15T11:45:00Z",
    remarks: [
      { id: "r2", text: "Customer requested extension", createdAt: "2024-09-10T16:30:00Z", createdBy: "Admin" },
      { id: "r3", text: "Follow-up scheduled for next week", createdAt: "2024-10-01T10:00:00Z", createdBy: "Admin" },
    ],
    activityLog: [
      {
        id: "a3",
        action: "Record Created",
        details: "Imported from aug_data.xlsx",
        timestamp: "2024-08-15T11:45:00Z",
        user: "System",
      },
      {
        id: "a4",
        action: "Status Changed",
        details: "Status updated to follow-up",
        timestamp: "2024-09-15T14:20:00Z",
        user: "Admin",
      },
    ],
  },
  {
    id: "p4",
    type: "protect",
    partner: "snapmint",
    nexusPurchaseDate: "2024-07-05",
    formFilledDate: "2024-07-10",
    name: "Sneha Gupta",
    mobileNumber: "9876123450",
    panNumber: "PQRST3456U",
    plan: "Premium",
    institution: "SBI",
    accountNumber: "XXXX3456",
    accountType: "Savings",
    dateOpened: "2019-08-25",
    emiDate: "2024-08-15",
    emiAmount: 12000,
    dpd: "120",
    currentDpd: "135",
    dpdGroup: "91-180",
    status: "closed",
    stage: "Resolved",
    uploadedFrom: "july_protect.xlsx",
    uploadedAt: "2024-07-10T08:00:00Z",
    remarks: [
      { id: "r4", text: "Settlement completed successfully", createdAt: "2024-10-15T12:00:00Z", createdBy: "Admin" },
    ],
    activityLog: [
      {
        id: "a5",
        action: "Record Created",
        details: "Imported from july_protect.xlsx",
        timestamp: "2024-07-10T08:00:00Z",
        user: "System",
      },
      {
        id: "a6",
        action: "Status Changed",
        details: "Status updated to closed",
        timestamp: "2024-10-15T12:00:00Z",
        user: "Admin",
      },
    ],
  },
  {
    id: "p5",
    type: "protect",
    partner: "sayyam",
    nexusPurchaseDate: "2024-11-01",
    formFilledDate: "2024-11-05",
    name: "Vikram Singh",
    mobileNumber: "9654321098",
    panNumber: "UVWXY7890Z",
    plan: "Basic",
    institution: "Kotak Bank",
    accountNumber: "XXXX7890",
    accountType: "Current",
    dateOpened: "2023-01-10",
    emiDate: "2024-11-20",
    emiAmount: 18500,
    dpd: "15",
    currentDpd: "18",
    dpdGroup: "0-30",
    status: "new",
    stage: "Initial Review",
    uploadedFrom: "nov_batch.xlsx",
    uploadedAt: "2024-11-05T15:30:00Z",
    remarks: [],
    activityLog: [
      {
        id: "a7",
        action: "Record Created",
        details: "Imported from nov_batch.xlsx",
        timestamp: "2024-11-05T15:30:00Z",
        user: "System",
      },
    ],
  },
]

// Sample Settlement Records
export const sampleSettlementRecords: SettlementRecord[] = [
  {
    id: "s1",
    type: "settlement",
    partner: "sayyam",
    nexusPurchaseDate: "2024-10-01",
    formFilledDate: "2024-10-05",
    createdDate: "2024-10-05",
    name: "Anita Desai",
    mobileNumber: "9876509876",
    serviceOpted: "Settlement",
    debtType: "Credit Card",
    lenderName: "HDFC Credit Cards",
    creditCardNo: "XXXX-XXXX-XXXX-4521",
    loanAccNo: "CC123456789",
    dueAmt: 85000,
    loanAmount: 85000,
    dueDate: "2024-10-30",
    isEmiBounced: true,
    isLegalNotice: false,
    currEmployment: "Private Sector",
    otherDetails: "None",
    recommendedAmt: 51000,
    customerWishAmt: 45000,
    dpd: "75",
    dpdRange: "60-90",
    lenderContact: "9876543210",
    fundsAvailable: true,
    settlementOption: "One Time",
    emiMonths: null,
    whatsappReachout: true,
    status: "in-progress",
    stage: "Negotiation",
    uploadedFrom: "oct_settlements.xlsx",
    uploadedAt: "2024-10-05T12:00:00Z",
    remarks: [
      { id: "r5", text: "Lender agreed to 60% settlement", createdAt: "2024-10-20T11:30:00Z", createdBy: "Admin" },
    ],
    activityLog: [
      {
        id: "a8",
        action: "Record Created",
        details: "Imported from oct_settlements.xlsx",
        timestamp: "2024-10-05T12:00:00Z",
        user: "System",
      },
    ],
  },
  {
    id: "s2",
    type: "settlement",
    partner: "snapmint",
    nexusPurchaseDate: "2024-09-15",
    formFilledDate: "2024-09-18",
    createdDate: "2024-09-18",
    name: "Rajesh Verma",
    mobileNumber: "9123098765",
    serviceOpted: "Settlement",
    debtType: "Personal Loan",
    lenderName: "Bajaj Finance",
    creditCardNo: "",
    loanAccNo: "BFL987654321",
    dueAmt: 125000,
    loanAmount: 125000,
    dueDate: "2024-09-25",
    isEmiBounced: true,
    isLegalNotice: true,
    currEmployment: "Self Employed",
    otherDetails: "High risk",
    recommendedAmt: 75000,
    customerWishAmt: 62500,
    dpd: "95",
    dpdRange: "90+",
    lenderContact: "9123456789",
    fundsAvailable: null,
    settlementOption: null,
    emiMonths: null,
    whatsappReachout: false,
    status: "follow-up",
    stage: "Legal Review",
    uploadedFrom: "sept_settlements.csv",
    uploadedAt: "2024-09-18T14:30:00Z",
    remarks: [
      {
        id: "r6",
        text: "Legal notice received, need urgent attention",
        createdAt: "2024-09-25T09:00:00Z",
        createdBy: "Admin",
      },
      { id: "r7", text: "Customer consulting with lawyer", createdAt: "2024-10-05T16:00:00Z", createdBy: "Admin" },
    ],
    activityLog: [
      {
        id: "a9",
        action: "Record Created",
        details: "Imported from sept_settlements.csv",
        timestamp: "2024-09-18T14:30:00Z",
        user: "System",
      },
      {
        id: "a10",
        action: "Status Changed",
        details: "Status updated to follow-up",
        timestamp: "2024-09-25T09:00:00Z",
        user: "Admin",
      },
    ],
  },
  {
    id: "s3",
    type: "settlement",
    partner: "sayyam",
    nexusPurchaseDate: "2024-08-20",
    formFilledDate: "2024-08-22",
    createdDate: "2024-08-22",
    name: "Meera Joshi",
    mobileNumber: "9988112233",
    serviceOpted: "Settlement",
    debtType: "Personal Loan",
    lenderName: "ICICI Personal Loan",
    creditCardNo: "",
    loanAccNo: "PL456789012",
    dueAmt: 200000,
    loanAmount: 200000,
    dueDate: "2024-08-31",
    isEmiBounced: false,
    isLegalNotice: false,
    currEmployment: "Government",
    otherDetails: "Steady income",
    recommendedAmt: 140000,
    customerWishAmt: 120000,
    dpd: "45",
    dpdRange: "30-60",
    lenderContact: "9988776655",
    fundsAvailable: true,
    settlementOption: "EMI",
    emiMonths: 3,
    whatsappReachout: true,
    status: "closed",
    stage: "Resolved",
    uploadedFrom: "aug_settlements.xlsx",
    uploadedAt: "2024-08-22T10:15:00Z",
    remarks: [{ id: "r8", text: "Settlement completed at 65%", createdAt: "2024-10-10T14:00:00Z", createdBy: "Admin" }],
    activityLog: [
      {
        id: "a11",
        action: "Record Created",
        details: "Imported from aug_settlements.xlsx",
        timestamp: "2024-08-22T10:15:00Z",
        user: "System",
      },
      {
        id: "a12",
        action: "Status Changed",
        details: "Status updated to closed",
        timestamp: "2024-10-10T14:00:00Z",
        user: "Admin",
      },
    ],
  },
  {
    id: "s4",
    type: "settlement",
    partner: "snapmint",
    nexusPurchaseDate: "2024-11-10",
    formFilledDate: "2024-11-12",
    createdDate: "2024-11-12",
    name: "Karan Malhotra",
    mobileNumber: "9876001234",
    serviceOpted: "Settlement",
    debtType: "Credit Card",
    lenderName: "Axis Credit Card",
    creditCardNo: "XXXX-XXXX-XXXX-7890",
    loanAccNo: "AX789012345",
    dueAmt: 55000,
    loanAmount: 55000,
    dueDate: "2024-11-25",
    isEmiBounced: false,
    isLegalNotice: false,
    currEmployment: "Private Sector",
    otherDetails: "",
    recommendedAmt: 38500,
    customerWishAmt: 33000,
    dpd: "15",
    dpdRange: "",
    lenderContact: "",
    fundsAvailable: null,
    settlementOption: null,
    emiMonths: null,
    whatsappReachout: null,
    status: "new",
    stage: "Initial Review",
    uploadedFrom: "nov_settlements.xlsx",
    uploadedAt: "2024-11-12T16:45:00Z",
    remarks: [],
    activityLog: [
      {
        id: "a13",
        action: "Record Created",
        details: "Imported from nov_settlements.xlsx",
        timestamp: "2024-11-12T16:45:00Z",
        user: "System",
      },
    ],
  },
]

// Sample Nexus Records
export const sampleNexusRecords: NexusRecord[] = [
  {
    id: "n1",
    type: "nexus",
    nexusPurchaseDate: "2024-11-15",
    formFilledDate: "",
    userId: "user_12345",
    name: "Aarav Patel",
    mobileNumber: "9876543210",
    email: "aarav.patel@example.com",
    status: "new",
    partner: "other",
    stage: "Onboarding",
    uploadedFrom: "nexus_batch_nov.csv",
    uploadedAt: "2024-11-20T10:00:00Z",
    remarks: [],
    activityLog: [
      {
        id: "a_n1",
        action: "Record Created",
        details: "Imported from nexus_batch_nov.csv",
        timestamp: "2024-11-20T10:00:00Z",
        user: "System",
      }
    ]
  },
  {
    id: "n2",
    type: "nexus",
    nexusPurchaseDate: "2024-10-05",
    formFilledDate: "2024-10-08",
    userId: "user_67890",
    name: "Ishaan Gupta",
    mobileNumber: "9123456789",
    email: "ishaan.g@example.com",
    status: "in-progress",
    partner: "other",
    stage: "Verification",
    uploadedFrom: "nexus_batch_oct.csv",
    uploadedAt: "2024-10-08T14:15:00Z",
    remarks: [
      {
        id: "r_n1",
        text: "User requested callback",
        createdAt: "2024-10-10T11:00:00Z",
        createdBy: "Support",
      }
    ],
    activityLog: [
      {
        id: "a_n2",
        action: "Record Created",
        details: "Imported from nexus_batch_oct.csv",
        timestamp: "2024-10-08T14:15:00Z",
        user: "System",
      }
    ]
  },
  {
    id: "n3",
    type: "nexus",
    nexusPurchaseDate: "2024-12-01",
    formFilledDate: "2024-12-02",
    userId: "user_54321",
    name: "Zara Khan",
    mobileNumber: "9988776655",
    email: "zara.k@example.com",
    status: "closed",
    partner: "other",
    stage: "Completed",
    uploadedFrom: "nexus_batch_dec.csv",
    uploadedAt: "2024-12-02T09:30:00Z",
    remarks: [],
    activityLog: [
      {
        id: "a_n3",
        action: "Record Created",
        details: "Imported from nexus_batch_dec.csv",
        timestamp: "2024-12-02T09:30:00Z",
        user: "System",
      }
    ]
  }

]

// Calculate dashboard stats
export function calculateDashboardStats(
  records: CRMRecord[],
  uploadHistory: UploadHistory[],
): DashboardStats {
  const protectRecords = records.filter((r) => r.type === "protect") as ProtectRecord[]
  const settlementRecords = records.filter((r) => r.type === "settlement") as SettlementRecord[]

  // DPD distribution for protect records
  const dpdGroups: Record<string, number> = { "0-30": 0, "31-60": 0, "61-90": 0, "91-180": 0, "180+": 0, "Unknown": 0 }
  protectRecords.forEach((r) => {
    if (dpdGroups[r.dpdGroup] !== undefined) {
      dpdGroups[r.dpdGroup]++
    } else {
      // Fallback for unexpected groups
      dpdGroups["Unknown"]++
    }
  })

  // Daily requests - Dynamic Range
  const dailyMap = new Map<string, { count: number; protect: number; settlement: number }>()

  records.forEach((r) => {
    let dateStr = ""
    if (r.type === "protect") {
      dateStr = r.formFilledDate
    } else if (r.type === "settlement") {
      dateStr = (r as SettlementRecord).createdDate || r.formFilledDate
    }

    if (!dateStr) return

    // Normalize to YYYY-MM-DD
    const date = dateStr.split("T")[0]

    // Validate date format (simple check)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return

    if (!dailyMap.has(date)) {
      dailyMap.set(date, { count: 0, protect: 0, settlement: 0 })
    }

    const entry = dailyMap.get(date)!
    entry.count++
    if (r.type === "protect") entry.protect++
    else if (r.type === "settlement") entry.settlement++
  })

  // Fill in gaps? User asked for "whole view of total requests... of all dates the data is uploaded".
  // Usually this means continuous timeline. Let's find min/max and fill gaps.
  const dates = Array.from(dailyMap.keys()).sort()

  if (dates.length > 0) {
    const minDate = new Date(dates[0])
    const maxDate = new Date() // Up to today

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split("T")[0]
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, { count: 0, protect: 0, settlement: 0 })
      }
    }
  }

  // Calculate Cases NPA Today
  let casesNPAToday = 0
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const todayStr = todayDate.toLocaleDateString("en-CA") // YYYY-MM-DD in local time

  records.forEach((r) => {
    // Skip Nexus records for NPA calculation as they don't have required payment fields
    if (r.type === "nexus") return

    // r is now ProtectRecord | SettlementRecord
    let referenceDateStr = r.lastPaymentDate

    // Fallback logic
    const isDefaultOrMissing = !referenceDateStr || referenceDateStr === todayStr

    if (isDefaultOrMissing) {
      if (r.type === "protect" && r.emiDate && r.emiDate !== todayStr) {
        referenceDateStr = r.emiDate
      } else if (r.type === "settlement" && r.dueDate && r.dueDate !== todayStr) {
        referenceDateStr = r.dueDate
      }
    }

    if (referenceDateStr) {
      const refDate = new Date(referenceDateStr)
      if (!isNaN(refDate.getTime())) {
        refDate.setHours(0, 0, 0, 0)
        const diffTime = todayDate.getTime() - refDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays >= 90) {
          casesNPAToday++
        }
      }
    }
  })

  // Helper to check if a date string matches today
  const isToday = (dateStr?: string) => {
    if (!dateStr) return false
    // Handle both YYYY-MM-DD and ISO string
    return dateStr.startsWith(todayStr)
  }

  const newRequests = records.filter(r => {
    if (r.type === "settlement") {
      return isToday((r as any).createdDate)
    } else if (r.type === "protect") {
      return isToday(r.formFilledDate)
    }
    return false
  })

  const newProtect = newRequests.filter(r => r.type === "protect")
  const newSettlement = newRequests.filter(r => r.type === "settlement")

  // Calculate Nexus stats
  const nexusRecords = records.filter(r => r.type === "nexus") as NexusRecord[]
  const totalNexus = nexusRecords.length
  const nexusFormFilled = nexusRecords.filter(r => !!r.formFilledDate).length
  const nexusFormNotFilled = totalNexus - nexusFormFilled

  return {
    totalRequests: protectRecords.length + settlementRecords.length,
    totalProtect: protectRecords.length,
    totalSettlement: settlementRecords.length,
    sayyamProtect: protectRecords.filter((r) => r.partner.toLowerCase() === "sayyam").length,
    sayyamSettlement: settlementRecords.filter((r) => r.partner.toLowerCase() === "sayyam").length,
    snapmintProtect: protectRecords.filter((r) => r.partner.toLowerCase() === "snapmint").length,
    snapmintSettlement: settlementRecords.filter((r) => r.partner.toLowerCase() === "snapmint").length,
    dpdDistribution: Object.entries(dpdGroups).map(([group, count]) => ({ group: group as any, count })),
    dailyRequests: Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    recentUploads: uploadHistory.slice(0, 5),
    newRequestsToday: newRequests.length,
    newProtectToday: newProtect.length,
    newSettlementToday: newSettlement.length,
    casesNPAToday,
    totalNexus,
    nexusFormFilled,
    nexusFormNotFilled
  }
}
