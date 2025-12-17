import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, X, Calendar as CalendarIcon, Building2 } from "lucide-react"
import { useCRMStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

export function FilterBar() {
    const {
        searchQuery,
        setSearchQuery,
        typeFilter,
        setTypeFilter,
        dateFilterType,
        setDateFilterType,
        setDateRange,
        getFilteredRecords,
        records,
        lenderFilter,
        setLenderFilter
    } = useCRMStore()

    const [date, setDate] = useState<DateRange | undefined>()
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const dateFilters = [
        { label: "Total", value: "total" },
        { label: "Today", value: "today" },
        { label: "7 Days", value: "7d" },
        { label: "30 Days", value: "30d" },
        { label: "1 Year", value: "1y" },
        { label: "Custom", value: "custom" },
    ] as const

    // Extract unique lenders/institutions
    const lenders = Array.from(new Set(records.flatMap(r => {
        if (r.type === "protect") return [(r as any).institution]
        if (r.type === "settlement") return [(r as any).lenderName]
        return []
    }))).filter(Boolean).sort()

    // Helper to calculate and set date range based on type
    const applyDateFilter = (value: typeof dateFilterType) => {
        const now = new Date()
        let start: Date
        let end = endOfDay(now)

        switch (value) {
            case "total":
                setDateRange("", "")
                break
            case "today":
                start = startOfDay(now)
                setDateRange(start.toISOString(), end.toISOString())
                break
            case "7d":
                start = subDays(now, 7)
                setDateRange(start.toISOString(), end.toISOString())
                break
            case "30d":
                start = subDays(now, 30)
                setDateRange(start.toISOString(), end.toISOString())
                break
            case "1y":
                start = subDays(now, 365)
                setDateRange(start.toISOString(), end.toISOString())
                break
            case "custom":
                setIsCalendarOpen(true)
                break
        }
    }

    const handleDateFilterChange = (value: typeof dateFilterType) => {
        setDateFilterType(value)
        applyDateFilter(value)
    }

    // Refresh date range on mount prevents stale dates from persistence
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (["total", "today", "7d", "30d", "1y"].includes(dateFilterType)) {
            applyDateFilter(dateFilterType)
        }
    }, [])

    const handleCustomDateSelect = (range: DateRange | undefined) => {
        setDate(range)
    }

    const applyCustomDate = () => {
        if (date?.from && date?.to) {
            setDateRange(date.from.toISOString(), date.to.toISOString())
            setIsCalendarOpen(false)
        }
    }

    const handleExport = () => {
        const records = getFilteredRecords()
        if (records.length === 0) return

        // Convert to CSV
        const headers = Object.keys(records[0]).join(",")
        const rows = records.map(r => Object.values(r).map(v =>
            typeof v === 'object' ? JSON.stringify(v) : `"${v}"`
        ).join(","))
        const csv = [headers, ...rows].join("\n")

        // Download
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `crm-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 2xl:pb-0 no-scrollbar">
                {dateFilters.map((filter) => (
                    <div key={filter.value} className="relative shrink-0">
                        {filter.value === "custom" ? (
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={dateFilterType === "custom" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsCalendarOpen(true)}
                                        className="rounded-full h-8"
                                    >
                                        Custom
                                        {dateFilterType === "custom" && <CalendarIcon className="ml-2 h-3 w-3" />}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <div className="p-3">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={handleCustomDateSelect}
                                            numberOfMonths={2}
                                        />
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={applyCustomDate}>
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Button
                                variant={dateFilterType === filter.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (dateFilterType === filter.value && filter.value !== 'total') {
                                        handleDateFilterChange("total")
                                    } else {
                                        handleDateFilterChange(filter.value)
                                    }
                                }}
                                className="rounded-full h-8"
                            >
                                {filter.label}
                                {dateFilterType === filter.value && filter.value !== 'total' && <X className="ml-2 h-3 w-3" />}
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full 2xl:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9"
                    />
                </div>

                <div className="w-full sm:w-[200px]">
                    <Select value={lenderFilter} onValueChange={setLenderFilter}>
                        <SelectTrigger className="h-9 w-full">
                            <div className="flex items-center gap-2 truncate">
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <SelectValue placeholder="All Lenders" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Lenders</SelectItem>
                            {lenders.map(lender => (
                                <SelectItem key={lender} value={lender}>
                                    {lender}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center border rounded-md overflow-hidden shrink-0">
                        <Button
                            variant={typeFilter === "both" ? "secondary" : "ghost"}
                            size="sm"
                            className="rounded-none h-9 px-3"
                            onClick={() => setTypeFilter("both")}
                        >
                            Total Requests
                        </Button>
                        <div className="w-[1px] h-4 bg-border" />
                        <Button
                            variant={typeFilter === "protect" ? "secondary" : "ghost"}
                            size="sm"
                            className="rounded-none h-9 px-3"
                            onClick={() => setTypeFilter("protect")}
                        >
                            Protect
                        </Button>
                        <div className="w-[1px] h-4 bg-border" />
                        <Button
                            variant={typeFilter === "settlement" ? "secondary" : "ghost"}
                            size="sm"
                            className="rounded-none h-9 px-3"
                            onClick={() => setTypeFilter("settlement")}
                        >
                            Settlement
                        </Button>
                    </div>

                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
