import type { CRMRecord, ProtectRecord, SettlementRecord } from "./types"

export interface FilterOptions {
    searchQuery: string
    statusFilter: string
    stageFilter?: string
    partnerFilter: string
    dateRangeStart: string
    dateRangeEnd: string
    partPaymentFilter?: string
    lenderFilter?: string
    dpdFilter?: string
    paymentDueToday?: boolean
}

function parseDateSafe(dateStr: string): Date | null {
    if (!dateStr) return null

    // 1. Try ISO-like YYYY-MM-DD
    const isoDate = new Date(dateStr.replace(" ", "T"))
    if (!isNaN(isoDate.getTime())) return isoDate

    // 2. Try DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/)
    if (dmyMatch) {
        const [, d, m, y] = dmyMatch
        // Month is 0-indexed in JS Date
        return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
    }

    return null
}

export function filterRecords(records: CRMRecord[], options: FilterOptions): CRMRecord[] {
    const { searchQuery, statusFilter, partnerFilter, dateRangeStart, dateRangeEnd, partPaymentFilter, lenderFilter, stageFilter, paymentDueToday } = options

    return records.filter((r) => {
        // Search Filter
        let matchesSearch = true
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const commonSearch =
                r.name.toLowerCase().includes(query) ||
                r.mobileNumber.includes(query)

            if (r.type === "protect") {
                matchesSearch = commonSearch || (r as ProtectRecord).accountNumber?.includes(query) || false
            } else if (r.type === "settlement") {
                matchesSearch = commonSearch || (r as SettlementRecord).loanAccNo?.toLowerCase().includes(query) || false
            } else if (r.type === "nexus") {
                matchesSearch = commonSearch || (r as any).email?.toLowerCase().includes(query) || false
            } else {
                matchesSearch = commonSearch
            }
        }

        // Status Filter
        let matchesStatus = true
        if (statusFilter !== "all") {
            if ((r.type === "protect") && (statusFilter === "Part Payment" || statusFilter === "Skip EMI")) {
                matchesStatus = (r as any).stage === statusFilter
            } else if (r.type === "nexus" && (statusFilter === "request-raised-yes" || statusFilter === "request-raised-no")) {
                const hasFilledForm = !!(r as any).formFilledDate
                matchesStatus = statusFilter === "request-raised-yes" ? hasFilledForm : !hasFilledForm
            } else {
                matchesStatus = r.status === statusFilter
            }
        }

        // Partner Filter
        const matchesPartner = partnerFilter === "all" || r.partner === partnerFilter

        // Lender Filter (Settlement & Protect)
        let matchesLender = true
        if (lenderFilter && lenderFilter !== "all") {
            if (r.type === "settlement") {
                matchesLender = (r as SettlementRecord).lenderName === lenderFilter
            } else if (r.type === "protect") {
                matchesLender = (r as ProtectRecord).institution === lenderFilter
            }
        }

        // Date Filter
        // Date Filter
        let matchesDate = true
        if (dateRangeStart && dateRangeEnd) {
            let dateStr = ""
            if (r.type === "settlement") {
                dateStr = (r as SettlementRecord).createdDate || r.formFilledDate
            } else if (r.type === "protect") {
                // EXPLICITLY using 'formFilledDate' for Protect records as requested (Created date)
                dateStr = (r as ProtectRecord).formFilledDate
            } else if (r.type === "nexus") {
                dateStr = (r as any).nexusPurchaseDate || r.formFilledDate
            }

            // Fallback
            if (!dateStr) {
                matchesDate = false
            } else {
                const recordDate = parseDateSafe(dateStr)

                const start = new Date(dateRangeStart)
                start.setHours(0, 0, 0, 0)

                const end = new Date(dateRangeEnd)
                end.setHours(23, 59, 59, 999)

                if (recordDate && !isNaN(recordDate.getTime()) && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    matchesDate = recordDate >= start && recordDate <= end
                } else {
                    // If record date is invalid, it shouldn't match.
                    matchesDate = false
                }
            }
        }

        // Part Payment Filter
        let matchesPartPayment = true
        if (partPaymentFilter && partPaymentFilter !== "all") {
            let amount = (r as any).partPaymentAmount || 0

            // If paymentParts exists, use the sum of parts
            if (Array.isArray((r as any).paymentParts) && (r as any).paymentParts.length > 0) {
                const partsTotal = (r as any).paymentParts.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)
                // If we have parts, their sum is the effective part payment amount
                if (partsTotal > 0) {
                    amount = partsTotal
                }
            }

            switch (partPaymentFilter) {
                case "0-500": matchesPartPayment = amount > 0 && amount <= 500; break;
                case "500-1000": matchesPartPayment = amount > 500 && amount <= 1000; break;
                case "1000-5000": matchesPartPayment = amount > 1000 && amount <= 5000; break;
                case "5000-10000": matchesPartPayment = amount > 5000 && amount <= 10000; break;
                case "10000+": matchesPartPayment = amount > 10000; break;
            }
        }

        // DPD Filter
        let matchesDpd = true
        if (options.dpdFilter && options.dpdFilter !== "all") {
            if (r.type === "settlement") {
                const dpdStr = String((r as SettlementRecord).dpd || "").trim()
                const dpd = parseInt(dpdStr, 10)

                if (isNaN(dpd)) {
                    matchesDpd = false // Should we include non-numerics? User said "random number", so assume numeric logic applies if it IS a number. If not number, filter out? Or keep in specific bucket?
                    // User said: "if any number falls between these... suppose dpd is 80... if 480"
                    // This implies we filter primarily on numbers.
                    // If DPD isn't a number, it shouldn't match any numeric range.
                } else {
                    switch (options.dpdFilter) {
                        case "0-30": matchesDpd = dpd >= 0 && dpd <= 30; break;
                        case "30-60": matchesDpd = dpd > 30 && dpd <= 60; break;
                        case "60-90": matchesDpd = dpd > 60 && dpd <= 90; break;
                        case "90+": matchesDpd = dpd > 90; break;
                    }
                }
            }
            // For now, only applying to settlement as requested. Protect logic for DPD is different/not requested here.
        }

        // Stage Filter
        let matchesStage = true
        if (stageFilter && stageFilter !== "all") {
            matchesStage = (r as any).stage === stageFilter
        }

        // Payment Due Today
        let matchesPaymentDue = true
        if (paymentDueToday) {
            const today = new Date().toISOString().split('T')[0]
            matchesPaymentDue = (r as any).paymentParts?.some((p: any) => p.date === today)
        }

        return matchesSearch && matchesStatus && matchesPartner && matchesDate && matchesPartPayment && matchesLender && matchesDpd && matchesStage && matchesPaymentDue
    })
}
