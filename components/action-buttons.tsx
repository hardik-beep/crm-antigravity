"use client"

import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import type { CRMRecord } from "@/lib/types"
import { useAuthStore } from "@/lib/auth-store"

interface ActionButtonsProps {
    record: CRMRecord
    onView: (r: CRMRecord) => void
    onDelete: (id: string) => void
}

export function ActionButtons({
    record,
    onView,
    onDelete,
}: ActionButtonsProps) {
    const user = useAuthStore(state => state.user)
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 transition-transform hover:scale-110 active:scale-95"
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    onView(record)
                }}
            >
                <Eye className="h-4 w-4 text-primary/80" />
            </Button>
            {user?.role !== 'agent' && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-transform hover:scale-110 active:scale-95"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        onDelete(record.id)
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
