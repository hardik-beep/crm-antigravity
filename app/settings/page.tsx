"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useCRMStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { UserManagement } from "@/components/settings/user-management"
import type { ProtectRecord, SettlementRecord } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Database, CheckCircle, Trash2, Sparkles } from "lucide-react"
import * as XLSX from "xlsx"

function downloadExcelFile(workbook: XLSX.WorkBook, filename: string) {
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("Admin")
  const [lastName, setLastName] = useState("User")
  const [email, setEmail] = useState("admin@crm.com")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [settlementAlerts, setSettlementAlerts] = useState(true)
  const [followUpReminders, setFollowUpReminders] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [saved, setSaved] = useState(false)

  const { records, setRecords, geminiApiKey, setGeminiApiKey } = useCRMStore()
  const user = useAuthStore(state => state.user)

  const handleSaveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportData = () => {
    const protectRecords = records.filter((r): r is ProtectRecord => r.type === "protect")
    const settlementRecords = records.filter((r): r is SettlementRecord => r.type === "settlement")

    // Export Protect Records
    const protectData = protectRecords.map((r) => ({
      "Nexus Purchase Date": r.nexusPurchaseDate,
      "Form Filled Date": r.formFilledDate,
      Name: r.name,
      "Mobile Number": r.mobileNumber,
      Plan: r.plan,
      Institution: r.institution,
      "Account Number": r.accountNumber,
      "Account Type": r.accountType,
      "Date Opened": r.dateOpened,
      "EMI Date": r.emiDate,
      "EMI Amount": r.emiAmount,
      DPD: r.dpd,
      "Current DPD": r.currentDpd,
      "DPD Group": r.dpdGroup,
      Status: r.status,
      Stage: r.stage,
      Partner: r.partner,
    }))

    // Export Settlement Records
    const settlementData = settlementRecords.map((r) => ({
      "Nexus Purchase Date": r.nexusPurchaseDate,
      "Form Filled Date": r.formFilledDate,
      Name: r.name,
      "Mobile Number": r.mobileNumber,
      "Lender Name": r.lenderName,
      "Credit Card No": r.creditCardNo,
      "Loan Acc No": r.loanAccNo,
      "Due Amt": r.dueAmt,
      "Due Date": r.dueDate,
      "EMI Bounced": r.isEmiBounced ? "Yes" : "No",
      "Legal Notice": r.isLegalNotice ? "Yes" : "No",
      Employment: r.currEmployment,
      "Recommended Amt": r.recommendedAmt,
      "Customer Wish Amt": r.customerWishAmt,
      Status: r.status,
      Stage: r.stage,
      Partner: r.partner,
    }))

    const wb = XLSX.utils.book_new()

    if (protectData.length > 0) {
      const wsProtect = XLSX.utils.json_to_sheet(protectData)
      XLSX.utils.book_append_sheet(wb, wsProtect, "Protect Records")
    }

    if (settlementData.length > 0) {
      const wsSettlement = XLSX.utils.json_to_sheet(settlementData)
      XLSX.utils.book_append_sheet(wb, wsSettlement, "Settlement Records")
    }

    downloadExcelFile(wb, `crm_export_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      setRecords([])
      localStorage.removeItem("crm-storage")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64">
        <Header title="Settings" subtitle="Manage your CRM preferences and configurations" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Admin User Management Panel */}
          {user?.role === 'admin' && (
            <UserManagement />
          )}

          {/* Profile Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">Profile Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">Update your personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <Button onClick={handleSaveProfile}>
                {saved ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">Notifications</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure how you receive notifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Settlement Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when cases are settled</p>
                </div>
                <Switch checked={settlementAlerts} onCheckedChange={setSettlementAlerts} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Follow-up Reminders</p>
                  <p className="text-xs text-muted-foreground">Reminders for scheduled follow-ups</p>
                </div>
                <Switch checked={followUpReminders} onCheckedChange={setFollowUpReminders} />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">Security</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage your account security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-foreground">
                  Current Password
                </Label>
                <Input id="currentPassword" type="password" className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">
                  New Password
                </Label>
                <Input id="newPassword" type="password" className="bg-muted/50 border-border" />
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>

          {/* AI Configuration */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">AI Configuration</CardTitle>
                  <CardDescription className="text-muted-foreground">Configure AI features for magic text correction</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-foreground">
                  Google Gemini API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key..."
                    className="bg-muted/50 border-border"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Required for "Magic Fix" grammar correction in remarks. Keys are stored locally in your browser.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">Data Management</CardTitle>
                  <CardDescription className="text-muted-foreground">Export and manage your CRM data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Export All Data</p>
                  <p className="text-xs text-muted-foreground">
                    Download all records as Excel ({records.length} records)
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData} disabled={records.length === 0}>
                  Export
                </Button>
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto Backup</p>
                  <p className="text-xs text-muted-foreground">Data is saved to browser storage automatically</p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">Clear All Data</p>
                  <p className="text-xs text-muted-foreground">Permanently delete all records</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleClearData}>
                  <Trash2 className="mr-2 h-4 w-4" /> Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
