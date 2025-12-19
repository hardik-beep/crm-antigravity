"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"
import { Clock, Loader2, LogIn } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export function PunchInModal() {
    const user = useAuthStore(state => state.user)
    const setPunchInTime = useAuthStore(state => state.setPunchInTime)
    const [isLoading, setIsLoading] = useState(false)

    const handlePunchIn = async () => {
        if (!user?.id) return
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/punch-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to punch in")
            }

            setPunchInTime(data.punchInTime)
            toast.success("Punched in successfully!")
        } catch (error) {
            toast.error("Failed to punch in. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Card className="w-full shadow-2xl border-t-4 border-t-orange-500 overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Punch In Required</CardTitle>
                        <CardDescription className="text-base">
                            Welcome back, {user?.name}.<br />
                            Please punch in to start your session.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-6 pb-8">
                        <Button
                            size="lg"
                            className="w-full text-lg gap-2 bg-orange-600 hover:bg-orange-700"
                            onClick={handlePunchIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Punching In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    Punch In Now
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
