"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ExcelUpload } from "@/components/excel-upload"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64">
        <Header title="Upload Data" subtitle="Import client data from Excel or CSV files" />

        <div className="p-6">
          <ExcelUpload />
        </div>
      </main>
    </div>
  )
}
