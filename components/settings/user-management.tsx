"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, UserX, Power, Loader2, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Agent {
    id: string
    username: string
    name: string
    role: 'admin' | 'agent'
    isLoggedIn: boolean
    punchInTime: string | null
    lastActiveTime: string | null
}

export function UserManagement() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // New Agent Form
    const [newUsername, setNewUsername] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newName, setNewName] = useState("")
    const [newRole, setNewRole] = useState("agent")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchAgents = async () => {
        try {
            setIsRefreshing(true)
            const res = await fetch('/api/admin/users')
            if (!res.ok) throw new Error('Failed to fetch agents')
            const data = await res.json()
            setAgents(data.agents || [])
        } catch (error) {
            toast.error('Failed to load agents')
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchAgents()
        const interval = setInterval(fetchAgents, 30000) // Auto-refresh every 30s
        return () => clearInterval(interval)
    }, [])

    const handleAddAgent = async () => {
        if (!newUsername || !newPassword || !newName) {
            toast.error("Please fill in all fields")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: newUsername,
                    password: newPassword,
                    name: newName,
                    role: newRole
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to add agent")
            }

            toast.success("Agent added successfully")
            setIsAddDialogOpen(false)
            setNewUsername("")
            setNewPassword("")
            setNewName("")
            fetchAgents()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add agent")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLogoutAgent = async (userId: string) => {
        try {
            const res = await fetch('/api/admin/users/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })

            if (!res.ok) throw new Error("Failed to logout agent")
            toast.success("Agent logged out successfully")
            fetchAgents()
        } catch (error) {
            toast.error("Failed to action")
        }
    }

    const handleDeleteAgent = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this agent? They will no longer be able to login.")) return

        try {
            const res = await fetch('/api/admin/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })

            if (!res.ok) throw new Error("Failed to delete agent")
            toast.success("Agent deleted successfully")
            fetchAgents()
        } catch (error) {
            toast.error("Failed to delete agent")
        }
    }

    const calculateInactiveDuration = (lastActive: string | null) => {
        if (!lastActive) return "N/A"
        const diff = Date.now() - new Date(lastActive).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return "Active now"
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        return `${hours}h ${minutes % 60}m ago`
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-foreground">Agent Management</CardTitle>
                            <CardDescription className="text-muted-foreground">Manage authorized agents and view active sessions</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => fetchAgents()} disabled={isRefreshing}>
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Agent
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Agent</DialogTitle>
                                    <DialogDescription>Create a new user ID and password for an agent.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>User ID / Username</Label>
                                        <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="john.doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select value={newRole} onValueChange={setNewRole}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="agent">Agent</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddAgent} disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Agent
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading agents...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Punch In</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agents.map((agent) => (
                                <TableRow key={agent.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{agent.name}</span>
                                            <span className="text-xs text-muted-foreground">{agent.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{agent.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {agent.isLoggedIn ? (
                                            <Badge className="bg-green-500/15 text-green-600 border-green-200">Online</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-muted-foreground">Offline</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">
                                        {agent.punchInTime ? new Date(agent.punchInTime).toLocaleTimeString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {agent.isLoggedIn ? calculateInactiveDuration(agent.lastActiveTime) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {agent.isLoggedIn && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                    onClick={() => handleLogoutAgent(agent.id)}
                                                    title="Revoke Session (Logout)"
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteAgent(agent.id)}
                                                title="Delete Agent"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {agents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No agents found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
