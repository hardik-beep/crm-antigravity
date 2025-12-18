import { Bell, HelpCircle, Sun, Moon, CheckCircle2, FileText, Upload, Shield, Gavel, FileSpreadsheet } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCRMStore } from "@/lib/store"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { setTheme, theme } = useTheme()
  const { records } = useCRMStore()

  // Aggregate and sort activity logs
  const notifications = records
    .flatMap(r => r.activityLog.map(log => ({ ...log, recordName: r.name, recordType: r.type })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50) // Limit to latest 50

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      <div className="flex flex-col">
        <h1
          className="text-xl font-semibold text-foreground tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          <div className="flex items-center gap-1.5 ml-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
              Live Sync
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">


        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border">
              <h4 className="font-semibold leading-none">Notifications</h4>
              <p className="text-xs text-muted-foreground mt-1">Recent updates and activities</p>
            </div>
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No recent notifications</div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((log) => (
                    <div key={log.id} className="flex flex-col gap-1 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">{log.action}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(log.timestamp), "MMM d, h:mm a")}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{log.details}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1">{log.recordType}</Badge>
                        <span className="text-[10px] text-muted-foreground">by {log.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Help Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>CRM Usage Guide</DialogTitle>
              <DialogDescription>
                Quick guide to managing your loan settlements and records.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /> Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Overview of metrics, recent activity, and quick filters. Use the "New Today" metric to track daily progress.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4" /> Protect Page</h3>
                  <p className="text-sm text-muted-foreground">Manage ongoing EMI protection plans. Track DPD, status, and part payments.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><Gavel className="h-4 w-4" /> Settlement Page</h3>
                  <p className="text-sm text-muted-foreground">Handle loan settlements and negotiations. Monitor bounced EMIs and legal notices.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><Upload className="h-4 w-4" /> Upload Data</h3>
                  <p className="text-sm text-muted-foreground">Bulk upload records via Excel/CSV. Ensure format matches the templates properly.</p>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Pro Tips</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Use the filters on top to narrow down records by Date, Status, or Partner.</li>
                  <li>Click on any row to view detailed history and add remarks.</li>
                  <li>Check the notification bell for real-time updates on record changes.</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
