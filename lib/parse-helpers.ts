import type { ProtectRecord, SettlementRecord, NexusRecord, Partner } from "./types"
import { getDPDGroup, detectPartner } from "./store"

// Normalize date from various formats
// Normalize date from various formats, returning null if invalid/empty
// Normalize date from various formats, returning null if invalid/empty
export function normalizeOptionalDate(value: unknown): string | null {
  if (!value) return null

  // Handle Excel serial dates
  const isNumeric = typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "")

  if (isNumeric) {
    const num = Number(value)
    // Excel's epoch is Dec 30, 1899
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const date = new Date(excelEpoch.getTime() + num * 86400000)
    return date.toISOString().split("T")[0]
  }

  let str = String(value).trim()
  if (!str) return null

  // Remove potential time components like " 12:00:00" or "T12:00:00" for regex matching simplicity
  // But be careful not to break ISO strings which we handle separately.

  // 1. ISO format (YYYY-MM-DD) - Check start of string
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`
  }

  // 2. DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY (with optional time)
  // Support 2 or 4 digit year.
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/)
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch
    let year = parseInt(y, 10)
    // Handle 2-digit year: assume 2000+
    if (year < 100) year += 2000

    const month = m.padStart(2, "0")
    const day = d.padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // 3. Try parsing with Date constructor for formats like "08 Dec 2025" or "Dec 08 2025"
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) {
    // Use local date parts to construct YYYY-MM-DD string to avoid UTC shift
    // getFullYear() uses local time of the system running the code (Browser)
    const y = parsed.getFullYear()
    const m = String(parsed.getMonth() + 1).padStart(2, "0")
    const d = String(parsed.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  return null
}

export function normalizeDate(value: unknown): string {
  const date = normalizeOptionalDate(value)
  return date || "" // Return empty string if no date found, do NOT default to today
}

// Normalize date to YYYY-MM-DD HH:MM:SS
export function normalizeDateTime(value: unknown): string {
  // Handle empty values
  if (value === null || value === undefined) return ""

  // Handle Excel serial dates (numeric or string representation of number)
  // Check if value is a number or a string that looks like a pure number
  const isNumeric = typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "")

  if (isNumeric) {
    const num = Number(value)
    // Heuristic: Excel serial dates are usually small positive numbers (e.g. 45000 for year 2023)
    // Unix timestamps are huge (e.g. 1700000000000)
    // If it's a Unix timestamp (ms), just use it.
    if (num > 10000000000) {
      return new Date(num).toISOString().replace("T", " ").split(".")[0]
    }

    // Otherwise treat as Excel serial date
    // Excel's epoch is Dec 30, 1899
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const date = new Date(excelEpoch.getTime() + num * 86400000)
    return date.toISOString().replace("T", " ").split(".")[0]
  }

  let str = String(value).trim()
  if (!str) return ""

  // 1. Check for standard ISO-like start (YYYY-MM-DD)
  // If it starts with YYYY-MM-DD, new Date() usually handles it, but let's be safe
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().replace("T", " ").split(".")[0]
    }
  }

  // 2. Check for DD/MM/YYYY or DD-MM-YYYY
  // Regex to capture Date parts and optional Time parts
  // Matches: 17/07/2025, 17-07-2025, 17.07.2025
  // Followed optionally by T or space, then HH:MM or HH:MM:SS
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/)

  if (dmyMatch) {
    const [, d, m, y, h, min, s] = dmyMatch
    let year = parseInt(y, 10)
    if (year < 100) year += 2000

    const month = m.padStart(2, "0")
    const day = d.padStart(2, "0")
    const hour = (h || "0").padStart(2, "0")
    const minute = (min || "0").padStart(2, "0")
    const second = (s || "0").padStart(2, "0")

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  // 3. Fallback to flexible Date parsing (handles "July 17, 2025")
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear()
    const m = String(parsed.getMonth() + 1).padStart(2, "0")
    const d = String(parsed.getDate()).padStart(2, "0")
    const h = String(parsed.getHours()).padStart(2, "0")
    const min = String(parsed.getMinutes()).padStart(2, "0")
    const s = String(parsed.getSeconds()).padStart(2, "0")
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }

  return str // Return original string if all parsing fails, so user sees the raw data
}

// Normalize numeric values
export function normalizeNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (!value) return 0

  const str = String(value).replace(/[₹$,]/g, "").replace(/\s/g, "").trim()

  const num = Number.parseFloat(str)
  return isNaN(num) ? 0 : num
}

// Normalize boolean values
export function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value
  if (!value) return false

  const str = String(value).toLowerCase().trim()
  return ["yes", "true", "1", "y"].includes(str)
}

// Get column value with multiple possible keys
export function getColumnValue(row: Record<string, unknown>, keys: string[]): unknown {
  // First try exact match (case-insensitive)
  for (const key of keys) {
    const lowerKey = key.toLowerCase()
    for (const [k, v] of Object.entries(row)) {
      if (k.toLowerCase() === lowerKey) {
        return v
      }
    }
  }

  // Then try fuzzy match
  for (const key of keys) {
    const lowerKey = key.toLowerCase()
    for (const [k, v] of Object.entries(row)) {
      if (k.toLowerCase().includes(lowerKey)) {
        return v
      }
    }
  }
  return undefined
}

// Helper to resolve partner with fallbacks
function resolvePartner(row: Record<string, unknown>, fileName: string, explicitPartner?: Partner): Partner {
  if (explicitPartner) return explicitPartner

  // 1. Try detecting from "Partner" or "Source" column specifically
  const partnerCol = String(getColumnValue(row, ["partner", "source", "client"]) || "").toLowerCase()
  if (partnerCol.includes("sayyam") || partnerCol.includes("sayam") || partnerCol === "sy") return "sayyam"
  if (partnerCol.includes("snapmint") || partnerCol.includes("snap mint") || partnerCol === "sm") return "snapmint"

  // 2. Try detecting from any row content
  const detected = detectPartner(row)
  if (detected) return detected

  // 3. Try detecting from filename
  const lowerFileName = fileName.toLowerCase()
  if (lowerFileName.includes("sayyam")) return "sayyam"
  if (lowerFileName.includes("snapmint")) return "snapmint"

  // 4. Default to other
  return "other"
}

// Parse a row as Protect record
export function parseProtectRow(row: Record<string, unknown>, fileName: string, partner?: Partner): ProtectRecord {
  const dpd = String(getColumnValue(row, ["dpd", "days past due", "delay"]) || "").trim()
  const currentDpd = String(getColumnValue(row, ["current dpd", "curr dpd", "current_dpd", "cur dpd"]) || "").trim()

  return {
    id: `protect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "protect",
    partner: resolvePartner(row, fileName, partner),
    nexusPurchaseDate: "",
    formFilledDate: normalizeDateTime(getColumnValue(row, ["created", "created date", "date", "form filled", "form filled date", "form_filled_date", "filled date", "created on"])),
    name: String(getColumnValue(row, ["name", "customer name", "client name", "cust name", "borrower name"]) || "").trim(),
    mobileNumber: String(getColumnValue(row, ["mobile number", "mobile", "phone", "contact", "ph no", "mob", "contact no"]) || "").trim(),
    panNumber: String(getColumnValue(row, ["pan_number", "pan number", "pan", "pan no"]) || "").trim(),
    plan: String(getColumnValue(row, ["plan", "scheme", "product"]) || "").trim(),
    institution: String(getColumnValue(row, ["institution", "bank", "lender", "bank name"]) || "").trim(),
    accountNumber: String(getColumnValue(row, ["account number", "acc no", "account no", "loan no", "lan"]) || "").trim(),
    accountType: String(getColumnValue(row, ["account type", "acc type"]) || "").trim(),
    dateOpened: normalizeDate(getColumnValue(row, ["date opened", "open date", "account open date"])),
    emiDate: normalizeDate(getColumnValue(row, ["emi date", "emi_date", "due date"])),
    emiAmount: normalizeNumber(getColumnValue(row, ["emi amount", "emi_amount", "emi"])),
    lastPaymentDate: normalizeDate(
      getColumnValue(row, ["last payment date", "last payment", "last paid", "last emi paid", "last_payment_date"]),
    ),
    dpd, // Store as string
    currentDpd, // Store as string
    dpdGroup: getDPDGroup(normalizeNumber(dpd)),
    status: "No Action Taken", // Default status
    stage: "New", // Default stage
    uploadedFrom: fileName,
    uploadedAt: new Date().toISOString(),
    remarks: [],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        action: "Record Created",
        details: `Imported from ${fileName}`,
        timestamp: new Date().toISOString(),
        user: "System",
      },
    ],
  }
}

// Parse a row as Settlement record
// Parse a row as Settlement record
export function parseSettlementRow(
  row: Record<string, unknown>,
  fileName: string,
  partner?: Partner,
): SettlementRecord {
  // 1. Created
  const createdDate = normalizeDateTime(getColumnValue(row, ["created", "created date", "date"])) || ""

  // 8. Loan Amount (Mapped to dueAmt as well for compat)
  const loanAmount = normalizeNumber(getColumnValue(row, ["loan amount", "loan amt", "amount"]))

  // 14. DPD
  const dpd = String(getColumnValue(row, ["dpd", "days past due"]) || "").trim()

  return {
    id: `settlement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "settlement",
    partner: resolvePartner(row, fileName, partner),
    nexusPurchaseDate: "", // Not in new template
    formFilledDate: "", // Not in new template
    createdDate,

    // 2. User
    name: String(getColumnValue(row, ["user", "user name", "username", "name"]) || "").trim(),

    // 3. Mobile No
    mobileNumber: String(getColumnValue(row, ["mobile no", "mobile", "mobile number", "phone"]) || "").trim(),

    serviceOpted: "", // Deprecated/Not in list

    // 4. Debt Type
    debtType: String(getColumnValue(row, ["debt type", "debt"]) || "").trim(),

    // 5. Creditor Name
    lenderName: String(getColumnValue(row, ["creditor name", "creditor", "lender name", "lender"]) || "").trim(),

    // 6. Credit Card No
    creditCardNo: String(getColumnValue(row, ["credit card no", "credit card number", "card no"]) || "").trim(),

    // 7. Loan Account No
    loanAccNo: String(getColumnValue(row, ["loan account no", "loan acc no", "loan account"]) || "").trim(),

    loanAmount,
    dueAmt: loanAmount, // Map to existing field for compatibility

    // 9. Due Date
    dueDate: normalizeDate(getColumnValue(row, ["due date"])),

    lastPaymentDate: "",

    // 10. Is EMI Bounced (Yes/No)
    isEmiBounced: normalizeBoolean(getColumnValue(row, ["is emi bounced", "emi bounced"])),

    // 11. Is Legal Notice (Yes/No)
    isLegalNotice: normalizeBoolean(getColumnValue(row, ["is legal notice", "legal notice"])),

    currEmployment: "", // Deprecated
    otherDetails: "", // Deprecated

    // 12. Recommended Amount
    recommendedAmt: normalizeNumber(getColumnValue(row, ["recommended amount", "recommended amt"])),

    // 13. Customer Wish Amount
    customerWishAmt: normalizeNumber(getColumnValue(row, ["customer wish amount", "customer wish amt"])),

    dpd,

    // Initialize Manual Fields
    dpdRange: "",
    lenderContact: "",
    fundsAvailable: null,
    settlementOption: null,
    emiMonths: null,
    whatsappReachout: null,

    status: "No Action Taken",
    stage: "New", // Default to New? Or implied by "Created"? User didn't specify stage/status column.
    paymentParts: [],
    uploadedFrom: fileName,
    uploadedAt: new Date().toISOString(),
    remarks: [],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        action: "Record Created",
        details: `Imported from ${fileName}`,
        timestamp: new Date().toISOString(),
        user: "System",
      },
    ],
  }
}

// Parse a row as Nexus record
export function parseNexusRow(
  row: Record<string, unknown>,
  fileName: string,
  partner?: Partner,
): NexusRecord {
  const purchaseDate = normalizeDate(
    getColumnValue(row, ["nexus purchased date", "nexus purchase date", "purchase date", "purchase_date", "date of purchase", "tx_date_time", "tx date time"]),
  )
  const isRequestRaised = String(getColumnValue(row, ["request_raised", "request raised"]) || "").trim().toLowerCase() === "yes"

  // Check specifically for "form filled" (Yes/No) or date formats
  const formFilledRaw = getColumnValue(row, ["form filled", "form filled date", "form_filled_date", "filled date", "date", "created on"])
  let formFilledDate = normalizeOptionalDate(formFilledRaw)

  // If not a valid date, check if it's "Yes"
  if (!formFilledDate) {
    const s = String(formFilledRaw || "").trim().toLowerCase()
    if (s === "yes" || s === "y") {
      formFilledDate = "Yes"
    }
  }

  // Fallback to request_raised logic if not found
  if (!formFilledDate && isRequestRaised) {
    formFilledDate = purchaseDate || new Date().toISOString().split('T')[0]
  }

  // Ensure we don't return null if logic above failed to find anything
  formFilledDate = formFilledDate || ""

  return {
    id: `nexus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "nexus",
    partner: partner || "other",
    nexusPurchaseDate: purchaseDate,
    formFilledDate,
    userId: String(getColumnValue(row, ["user id", "userid", "user_id", "id"]) || "").trim(),
    name: String(getColumnValue(row, ["user", "name", "full name", "username", "full_name"]) || "").trim(),
    mobileNumber: String(getColumnValue(row, ["mobile", "mobile number", "phone", "contact", "mobile_number"]) || "").trim(),
    email: String(getColumnValue(row, ["email", "email id", "mail", "e-mail"]) || "").trim(),
    status: "new",
    stage: "New Lead",
    uploadedFrom: fileName,
    uploadedAt: new Date().toISOString(),
    remarks: [],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        action: "Record Created",
        details: `Imported from ${fileName}`,
        timestamp: new Date().toISOString(),
        user: "System",
      },
    ],
  }
}
