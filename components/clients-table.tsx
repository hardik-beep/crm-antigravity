"use client"

import { useState } from "react"
import type { Client } from "@/lib/types"
import { useCRMStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  negotiating: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  settled: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  negotiating: "Negotiating",
  settled: "Settled",
  rejected: "Rejected",
}

const loanTypeLabels = {
  personal: "Personal",
  mortgage: "Mortgage",
  auto: "Auto",
  business: "Business",
  "credit-card": "Credit Card",
}

interface ClientsTableProps {
  onViewClient: (client: Client) => void
}

export function ClientsTable({ onViewClient }: ClientsTableProps) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loanTypeFilter,
    setLoanTypeFilter,
    getFilteredClients,
  } = useCRMStore()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredClients = getFilteredClients()
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleLoanTypeChange = (value: string) => {
    setLoanTypeFilter(value)
    setCurrentPage(1)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle
            className="text-lg font-semibold text-card-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All Clients
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-[200px] pl-9 bg-secondary border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={loanTypeFilter} onValueChange={handleLoanTypeChange}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue placeholder="Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="mortgage">Mortgage</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-muted-foreground font-medium">Client</TableHead>
                <TableHead className="text-muted-foreground font-medium">Loan Type</TableHead>
                <TableHead className="text-muted-foreground font-medium">Creditor</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Loan Amount</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Settlement</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Agent</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No clients found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="hover:bg-secondary/30 cursor-pointer"
                    onClick={() => onViewClient(client)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-card-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{loanTypeLabels[client.loanType]}</TableCell>
                    <TableCell className="text-muted-foreground">{client.creditor}</TableCell>
                    <TableCell className="text-right font-medium text-card-foreground font-mono">
                      ${client.loanAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium text-primary font-mono">
                          ${client.settlementAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-success">
                          Save {Math.round((1 - client.settlementAmount / client.loanAmount) * 100)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", statusStyles[client.settlementStatus])}>
                        {statusLabels[client.settlementStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.assignedAgent}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewClient(client)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredClients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-secondary border-border"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(currentPage !== page && "bg-secondary border-border")}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="bg-secondary border-border"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
