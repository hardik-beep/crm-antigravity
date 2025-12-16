"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, FileText } from "lucide-react"
import { format } from "date-fns"
import type { UploadHistory } from "@/lib/types"

interface FileListProps {
    files: UploadHistory[]
    type: "protect" | "settlement"
    onDelete: (id: string) => void
    onView: (id: string) => void
}

export function FileList({ files, type, onDelete, onView }: FileListProps) {
    const filteredFiles = files.filter(f => f.recordType === type)

    if (filteredFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/10">
                <div className="p-3 rounded-full bg-muted mb-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium">No files uploaded</h3>
                <p className="text-xs text-muted-foreground mt-1">Upload a {type} file to get started</p>
            </div>
        )
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Uploaded On</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell>
                                <button
                                    onClick={() => onView(file.id)}
                                    className="font-medium hover:underline text-left focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 -ml-1"
                                >
                                    {file.fileName}
                                </button>
                            </TableCell>
                            <TableCell>{file.totalRows}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                                {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => onDelete(file.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
