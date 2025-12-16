
"use client"

import { useState, useEffect } from "react"
import { useCRMStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectRecord, SettlementRecord, Partner } from "@/lib/types"

interface AddRecordModalProps {
    open: boolean
    onClose: () => void
    defaultType: "protect" | "settlement"
}

export function AddRecordModal({ open, onClose, defaultType }: AddRecordModalProps) {
    const { addRecords } = useCRMStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [type, setType] = useState<"protect" | "settlement">(defaultType)

    // Common Fields
    const [name, setName] = useState("")
    const [mobile, setMobile] = useState("")
    const [partner, setPartner] = useState<Partner>("other")

    // Protect Fields
    const [institution, setInstitution] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [plan, setPlan] = useState("")
    const [emiAmount, setEmiAmount] = useState("")
    const [dpd, setDpd] = useState("")

    // Settlement Fields
    const [lenderName, setLenderName] = useState("")
    const [loanAccNo, setLoanAccNo] = useState("")
    const [loanAmount, setLoanAmount] = useState("")
    const [debtType, setDebtType] = useState("")

    useEffect(() => {
        if (open) {
            setType(defaultType)
            // Reset fields
            setName("")
            setMobile("")
            setPartner("other")
            setInstitution("")
            setAccountNumber("")
            setPlan("")
            setEmiAmount("")
            setDpd("")
            setLenderName("")
            setLoanAccNo("")
            setLoanAmount("")
            setDebtType("")
        }
    }, [open, defaultType])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const timestamp = new Date().toISOString()
            const commonFields = {
                name: name.trim(),
                mobileNumber: mobile.trim(),
                partner,
                uploadedAt: timestamp,
                uploadedFrom: "Manual Entry",
                remarks: [],
                activityLog: [{
                    id: `log-${Date.now()}`,
                    action: "Record Created",
                    details: "Created manually",
                    timestamp,
                    user: "Admin" // Or current user if we had auth context here easily
                }]
            }

            if (type === "protect") {
                const newRecord: ProtectRecord = {
                    ...commonFields,
                    id: `protect-${Date.now()}`,
                    type: "protect",
                    institution: institution.trim(),
                    accountNumber: accountNumber.trim(),
                    plan: plan.trim(),
                    emiAmount: Number(emiAmount) || 0,
                    dpd: dpd.trim(),
                    currentDpd: dpd.trim(), // defaulting to same
                    nexusPurchaseDate: "",
                    formFilledDate: timestamp.split("T")[0],
                    panNumber: "",
                    accountType: "",
                    dateOpened: "",
                    emiDate: "",
                    dpdGroup: "Unknown",
                    status: "new",
                    stage: "New",
                }
                await addRecords([newRecord], {
                    id: `upload-${Date.now()}`,
                    fileName: "Manual Entry",
                    uploadedAt: timestamp,
                    recordType: "protect",
                    partner,
                    totalRows: 1,
                    validRows: 1,
                    invalidRows: 0
                })
            } else {
                const newRecord: SettlementRecord = {
                    ...commonFields,
                    id: `settlement-${Date.now()}`,
                    type: "settlement",
                    lenderName: lenderName.trim(),
                    loanAccNo: loanAccNo.trim(),
                    loanAmount: Number(loanAmount) || 0,
                    dueAmt: Number(loanAmount) || 0,
                    debtType: debtType.trim(),
                    createdDate: timestamp,
                    formFilledDate: "",
                    nexusPurchaseDate: "",
                    creditCardNo: "",
                    dueDate: "",
                    isEmiBounced: false,
                    isLegalNotice: false,
                    serviceOpted: "",
                    currEmployment: "",
                    otherDetails: "",
                    recommendedAmt: 0,
                    customerWishAmt: 0,
                    dpd: "", // not asking for dpd in settlement manual for simplicity unless needed
                    dpdRange: "",
                    lenderContact: "",
                    fundsAvailable: null,
                    settlementOption: null,
                    whatsappReachout: null,
                    status: "new",
                    stage: "New"
                }
                await addRecords([newRecord], {
                    id: `upload-${Date.now()}`,
                    fileName: "Manual Entry",
                    uploadedAt: timestamp,
                    recordType: "settlement",
                    partner,
                    totalRows: 1,
                    validRows: 1,
                    invalidRows: 0
                })
            }
            onClose()
        } catch (error) {
            console.error("Failed to add record", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <Select value={type} onValueChange={(v: any) => setType(v)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="protect">Protect</SelectItem>
                                <SelectItem value="settlement">Settlement</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mobile" className="text-right">Mobile</Label>
                        <Input id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Partner</Label>
                        <Select value={partner} onValueChange={(v: any) => setPartner(v)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="sayyam">Sayyam</SelectItem>
                                <SelectItem value="snapmint">Snapmint</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {type === "protect" ? (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="institution" className="text-right">Lender</Label>
                                <Input id="institution" value={institution} onChange={e => setInstitution(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="accountNumber" className="text-right">Acc No</Label>
                                <Input id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="plan" className="text-right">Plan</Label>
                                <Input id="plan" value={plan} onChange={e => setPlan(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="emiAmount" className="text-right">EMI Amt</Label>
                                <Input id="emiAmount" type="number" value={emiAmount} onChange={e => setEmiAmount(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dpd" className="text-right">DPD</Label>
                                <Input id="dpd" value={dpd} onChange={e => setDpd(e.target.value)} className="col-span-3" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lenderName" className="text-right">Lender</Label>
                                <Input id="lenderName" value={lenderName} onChange={e => setLenderName(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="loanAccNo" className="text-right">Loan Acc</Label>
                                <Input id="loanAccNo" value={loanAccNo} onChange={e => setLoanAccNo(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="loanAmount" className="text-right">Amount</Label>
                                <Input id="loanAmount" type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="debtType" className="text-right">Debt Type</Label>
                                <Input id="debtType" value={debtType} onChange={e => setDebtType(e.target.value)} className="col-span-3" />
                            </div>
                        </>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Add Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
