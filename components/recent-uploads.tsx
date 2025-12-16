"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet } from "lucide-react"
import type { UploadHistory } from "@/lib/types"

interface RecentUploadsProps {
  uploads: UploadHistory[]
}

export function RecentUploads({ uploads }: RecentUploadsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{upload.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(upload.uploadedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={
                      upload.recordType === "protect"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-green-500/10 text-green-500 border-green-500/20"
                    }
                  >
                    {upload.recordType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{upload.validRows} rows</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
