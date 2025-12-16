"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UploadCardProps {
    type: "protect" | "settlement"
    onUpload: (file: File) => Promise<void>
    isUploading?: boolean
    disabled?: boolean
}

export function UploadCard({ type, onUpload, isUploading = false, disabled = false }: UploadCardProps) {
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = async (file: File) => {
        setFile(file)
        setStatus("uploading")
        setProgress(0)

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval)
                    return 90
                }
                return prev + 10
            })
        }, 200)

        try {
            await onUpload(file)
            clearInterval(interval)
            setProgress(100)
            setStatus("success")
            setMessage("File uploaded successfully")
            setTimeout(() => {
                setFile(null)
                setStatus("idle")
                setProgress(0)
                setMessage("")
            }, 3000)
        } catch (error) {
            clearInterval(interval)
            setStatus("error")
            setMessage("Upload failed. Please try again.")
        }
    }

    return (
        <Card className={cn("border-dashed", dragActive && "border-primary bg-primary/5")}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {type} Upload
                </CardTitle>
            </CardHeader>
            <CardContent>
                {status === "idle" ? (
                    <div
                        className="flex flex-col items-center justify-center py-8 text-center cursor-pointer"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
                    >
                        <input
                            id={`file-upload-${type}`}
                            type="file"
                            className="hidden"
                            accept=".csv,.xlsx,.txt"
                            onChange={handleChange}
                            disabled={disabled}
                        />
                        <div className="p-3 rounded-full bg-muted mb-3">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">CSV, Excel or Text files</p>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-muted">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(file?.size ? (file.size / 1024).toFixed(1) : 0)} KB
                                </p>
                            </div>
                            {status === "uploading" && (
                                <Button variant="ghost" size="icon" onClick={() => setStatus("idle")}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                            {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>{status === "uploading" ? "Uploading..." : status === "success" ? "Completed" : "Error"}</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className={cn("h-2", status === "error" && "bg-red-100 [&>div]:bg-red-500")} />
                        </div>

                        {message && (
                            <p className={cn("text-xs", status === "error" ? "text-red-500" : "text-green-500")}>
                                {message}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
