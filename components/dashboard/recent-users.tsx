"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for recent users
const recentUsers = [
    { id: "1", name: "Alice Johnson", role: "Admin", lastActive: "2 mins ago", avatar: "/avatars/01.png" },
    { id: "2", name: "Bob Smith", role: "Agent", lastActive: "15 mins ago", avatar: "/avatars/02.png" },
    { id: "3", name: "Carol Williams", role: "Manager", lastActive: "1 hour ago", avatar: "/avatars/03.png" },
    { id: "4", name: "David Brown", role: "Agent", lastActive: "2 hours ago", avatar: "/avatars/04.png" },
    { id: "5", name: "Eva Davis", role: "Agent", lastActive: "3 hours ago", avatar: "/avatars/05.png" },
    { id: "6", name: "Frank Miller", role: "Admin", lastActive: "5 hours ago", avatar: "/avatars/06.png" },
    { id: "7", name: "Grace Wilson", role: "Manager", lastActive: "1 day ago", avatar: "/avatars/07.png" },
    { id: "8", name: "Henry Taylor", role: "Agent", lastActive: "1 day ago", avatar: "/avatars/08.png" },
]

export function RecentUsers() {
    return (
        <Card>
            <CardHeader className="pb-3 sticky top-0 bg-background z-10 border-b">
                <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                    <div className="divide-y">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                                </div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    {user.lastActive}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
