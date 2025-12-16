"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Shield, Handshake, Upload, Settings, ChevronRight, FileSpreadsheet } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { LogOut, Clock, User as UserIcon } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { format } from "date-fns"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Protect", href: "/protect", icon: Shield },
  { name: "Settlement", href: "/settlement", icon: Handshake },
  { name: "Nexus Purchased", href: "/nexus-purchased", icon: Handshake },
  { name: "Upload Data", href: "/upload", icon: Upload },
  { name: "Settings", href: "/settings", icon: Settings },
]

function UserProfile() {
  const { user, logout, punchIn, punchOut, getLastPunch } = useAuthStore()

  if (!user) return null

  const lastPunch = getLastPunch(user.id)
  const isPunchedIn = lastPunch?.type === 'in'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 hover:bg-muted transition-colors text-left">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 shrink-0">
            <span className="text-xs font-medium text-primary">
              {user.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate capitalize">{user.role}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start" side="right">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {user.role === 'agent' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Attendance</span>
                {lastPunch && (
                  <span>{format(new Date(lastPunch.timestamp), "h:mm a")}</span>
                )}
              </div>
              {isPunchedIn ? (
                <Button
                  variant="outline"
                  className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500"
                  onClick={punchOut}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Punch Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-green-200 hover:bg-green-50 hover:text-green-600 text-green-500"
                  onClick={punchIn}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Punch In
                </Button>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore(state => state.user)

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileSpreadsheet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">CRM</span>
            <span className="text-xs text-muted-foreground">CRM Platform</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Main Menu</div>
          {navigation.map((item) => {
            if (item.name === "Upload Data" && user?.role === "agent") {
              return null
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <UserProfile />
        </div>
      </div>
    </aside>
  )
}
