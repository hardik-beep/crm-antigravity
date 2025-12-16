"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { useCRMStore, detectRecordType } from "@/lib/store"
import { parseProtectRow, parseSettlementRow, parseNexusRow, getColumnValue, normalizeDateTime } from "@/lib/parse-helpers"
import type { CRMRecord, UploadHistory, Partner } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Download, Loader2 } from "lucide-react"

interface ParsedRow {
  data: Record<string, unknown>
  valid: boolean
  errors: string[]
}

export function ExcelUpload() {
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [detectedType, setDetectedType] = useState<"protect" | "settlement" | "nexus">("protect")
  const [selectedPartner, setSelectedPartner] = useState<Partner | "auto">("auto")
  const {
    addRecords,
    setDateFilterType,
    setDateRange,
    setStatusFilter,
    setPartnerFilter,
    setDpdGroupFilter,
    setSearchQuery,
    setTypeFilter
  } = useCRMStore()

  const validateRow = (row: Record<string, unknown>, type: "protect" | "settlement" | "nexus"): ParsedRow => {
    const errors: string[] = []

    const name = String(
      getColumnValue(row, ["name", "customer name", "client name", "cust name", "borrower name", "user", "full_name"]) || "",
    ).trim()

    const mobile = String(
      getColumnValue(row, ["mobile", "mobile number", "phone", "contact", "ph no", "mob", "contact no", "mobile_number"]) || "",
    ).trim()

    if (type === "nexus") {
      const email = String(getColumnValue(row, ["email", "email id", "mail"]) || "").trim()
      const userId = String(getColumnValue(row, ["user id", "userid", "id", "user_id"]) || "").trim()

      // For Nexus, we might need different validations
      if (!name) errors.push("User/Name required")
      if (!userId) errors.push("User ID required")
      // Mobile not strictly required for Nexus? user said "User Id    User    Mobile number    Email    Purchase date    Form Filled"
      // Let's assume valid if at least ID or Name
    } else {
      if (!name) errors.push("Name required")
      if (!mobile || mobile.length < 10) errors.push("Valid mobile required")
    }

    return { data: row, valid: errors.length === 0, errors }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFileName(file.name)
    setIsProcessing(true)
    setUploadSuccess(false)
    setErrorMessage(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]

        if (jsonData.length > 0) {
          const cols = Object.keys(jsonData[0])
          setColumns(cols)
          const type = detectRecordType(cols)
          setDetectedType(type)

          const validated = jsonData.map((row) => validateRow(row, type))
          setParsedData(validated)
        }
      } catch (err: any) {
        console.error("Error parsing file:", err)
        setErrorMessage("Failed to read file. It might be corrupted or in an unsupported format. Please try opening it in Excel and 'Save As' a new .xlsx file.")
        setFileName("")
      } finally {
        setIsProcessing(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  })

  const handleImport = () => {
    try {
      const validRows = parsedData.filter((r) => r.valid)
      const partnerToPass = selectedPartner === "auto" ? undefined : selectedPartner

      const newRecords: CRMRecord[] = validRows.map((row) => {
        if (detectedType === "protect") {
          return parseProtectRow(row.data, fileName, partnerToPass)
        } else if (detectedType === "settlement") {
          return parseSettlementRow(row.data, fileName, partnerToPass)
        } else {
          return parseNexusRow(row.data, fileName, partnerToPass)
        }
      })

      const uploadRecord: UploadHistory = {
        id: `upload-${Date.now()}`,
        fileName,
        uploadedAt: new Date().toISOString(),
        recordType: detectedType,
        partner: selectedPartner === "auto" ? "sayyam" : selectedPartner, // Default for history
        totalRows: parsedData.length,
        validRows: validRows.length,
        invalidRows: parsedData.length - validRows.length,
      }

      addRecords(newRecords, uploadRecord)

      // Reset all filters to ensure new records are visible
      setDateFilterType("custom")
      setDateRange("", "")
      setStatusFilter("all")
      setPartnerFilter("all")
      setDpdGroupFilter("all")
      setSearchQuery("")
      setTypeFilter("both")

      setUploadSuccess(true)
      setParsedData([])
      setColumns([])
      setFileName("")

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error: any) {
      console.error("Import failed:", error)
      const msg = error instanceof Error ? error.message : String(error)
      setErrorMessage(`Import failed: ${msg}. If this persists, try clearing data or checking the file.`)
    }
  }

  const handleClear = () => {
    setParsedData([])
    setColumns([])
    setFileName("")
    setUploadSuccess(false)
  }

  const downloadProtectTemplate = () => {
    const template = [
      {
        "Created": "July 17, 2025, 4:20 PM",
        Name: "John Doe",
        "Mobile Number": "9876543210",
        "PAN_NUMBER": "ABCDE1234F",
        Plan: "Premium",
        Institution: "HDFC Bank",
        "Account Number": "XXXX1234",
        "Account Type": "Savings",
        "Date Opened": "2022-05-10",
        "EMI Date": "2024-02-05",
        "EMI Amount": 15000,
        DPD: 45,
        "Current DPD": 50,
      },
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Protect Template")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "protect_template.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadSettlementTemplate = () => {
    const headers = [
      "Created",
      "User",
      "Mobile No",
      "Debt Type",
      "Creditor Name",
      "Credit Card No",
      "Loan Account No",
      "Loan Amount",
      "Due Date",
      "Is EMI Bounced",
      "Is Legal Notice",
      "Recommended Amount",
      "Customer Wish Amount",
      "DPD"
    ]
    const checkRow = [
      "2024-01-01 10:30:00",
      "John Doe",
      "9999999999",
      "Credit Card",
      "HDFC Bank",
      "XXXX-XXXX-XXXX-1234",
      "123456789",
      50000,
      "2024-02-01",
      "Yes",
      "No",
      30000,
      25000,
      "90+"
    ]
    const ws = XLSX.utils.aoa_to_sheet([headers, checkRow])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Settlement Template")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "settlement_template.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadNexusTemplate = () => {
    const template = [
      {
        "User Id": "U12345",
        "Name": "Alice Smith",
        "Mobile Number": "9876543210",
        "Email": "alice@example.com",
        "Nexus Purchase Date": "2024-03-10",
        "Form Filled": "Yes",
      },
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Nexus Template")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "nexus_template.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const validCount = parsedData.filter((r) => r.valid).length
  const invalidCount = parsedData.filter((r) => !r.valid).length

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Import Data</CardTitle>
              <CardDescription className="text-muted-foreground">
                Upload Excel (.xlsx, .xls) or CSV files to import client data
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadProtectTemplate}>
                <Download className="mr-2 h-4 w-4" /> Protect Template
              </Button>
              <Button variant="outline" size="sm" onClick={downloadSettlementTemplate}>
                <Download className="mr-2 h-4 w-4" /> Settlement Template
              </Button>
              <Button variant="outline" size="sm" onClick={downloadNexusTemplate}>
                <Download className="mr-2 h-4 w-4" /> Nexus Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30",
            )}
          >
            <input {...getInputProps()} />

            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Processing file...</p>
              </div>
            ) : uploadSuccess ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-lg font-medium text-foreground">Import Successful!</p>
                <p className="text-sm text-muted-foreground">Records have been added to your CRM</p>
                <Button variant="outline" onClick={handleClear} className="mt-2 bg-transparent">
                  Import More
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-muted p-3">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-lg font-medium text-foreground">
                  {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
                <div className="mt-4 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Supports .xlsx, .xls, and .csv files</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {parsedData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Preview Import Data</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {fileName} - {parsedData.length} rows detected
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge
                    variant="outline"
                    className={
                      detectedType === "protect"
                        ? "bg-blue-500/10 text-blue-500"
                        : detectedType === "settlement"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-purple-500/10 text-purple-500"
                    }
                  >
                    {detectedType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Partner:</span>
                  <Select value={selectedPartner} onValueChange={(v) => setSelectedPartner(v as Partner | "auto")}>
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Detect</SelectItem>
                      <SelectItem value="sayyam">Sayyam</SelectItem>
                      <SelectItem value="snapmint">Snapmint</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="mr-1 h-3 w-3" /> {validCount} Valid
                </Badge>
                {invalidCount > 0 && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                    <AlertCircle className="mr-1 h-3 w-3" /> {invalidCount} Invalid
                  </Badge>
                )}
                <Button variant="ghost" size="icon" onClick={handleClear}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-muted-foreground font-medium text-xs w-10">Status</TableHead>
                    {columns.slice(0, 6).map((col) => (
                      <TableHead key={col} className="text-muted-foreground font-medium text-xs whitespace-nowrap">
                        {col}
                      </TableHead>
                    ))}
                    <TableHead className="text-muted-foreground font-medium text-xs">Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 20).map((row, index) => (
                    <TableRow key={index} className={cn("hover:bg-muted/20", !row.valid && "bg-red-500/5")}>
                      <TableCell>
                        {row.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      {columns.slice(0, 6).map((col) => {
                        const val = row.data[col]
                        let displayVal = String(val || "-")
                        if (col.toLowerCase().includes("created") || col.toLowerCase().includes("date")) {
                          displayVal = normalizeDateTime(val)
                        }
                        return (
                          <TableCell key={col} className="text-xs whitespace-nowrap">
                            {displayVal}
                          </TableCell>
                        )
                      })}
                      <TableCell>
                        {row.errors.length > 0 && <span className="text-xs text-red-500">{row.errors.join(", ")}</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedData.length > 20 && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Showing first 20 of {parsedData.length} rows
              </p>
            )}

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleClear}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={validCount === 0}>
                <CheckCircle className="mr-2 h-4 w-4" /> Import {validCount} Records
              </Button>
            </div>
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
