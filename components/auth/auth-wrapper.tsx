"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useCRMStore } from "@/lib/store"
import { LoginScreen } from "./login-screen"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeIn } from "@/lib/animations"
import { PunchInModal } from "./punch-in-modal"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)
    const fetchRecords = useCRMStore(state => state.fetchRecords)
    const fetchUploadHistory = useCRMStore(state => state.fetchUploadHistory)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Heartbeat to keep session active
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return

        const sendHeartbeat = async () => {
            try {
                const res = await fetch('/api/auth/heartbeat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                })

                if (res.status === 401) {
                    // Session invalid (logged out by admin)
                    logout()
                }
            } catch (e) {
                console.error("Heartbeat failed", e)
            }
        }

        sendHeartbeat() // Send immediately
        const interval = setInterval(sendHeartbeat, 60000) // Then every 60s

        return () => clearInterval(interval)
    }, [isAuthenticated, user?.id, logout])

    // Fetch data on auth and poll for updates
    useEffect(() => {
        if (isAuthenticated) {
            // Initial fetch
            fetchRecords()
            fetchUploadHistory()

            // Poll every 15 seconds to keep data in sync
            const interval = setInterval(() => {
                fetchRecords()
                fetchUploadHistory()
            }, 15000)

            return () => clearInterval(interval)
        }
    }, [isAuthenticated, fetchRecords, fetchUploadHistory])

    if (!mounted) {
        return null // Avoid hydration mismatch
    }

    return (
        <AnimatePresence mode="wait">
            {!isAuthenticated ? (
                <LoginScreen key="login" />
            ) : (
                <>
                    {/* Punch In Modal - Blocks access if not punched in */}
                    {(!user?.punchInTime && user?.role !== 'admin') && (
                        <PunchInModal />
                    )}

                    <motion.div
                        key="app"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={fadeIn}
                        className="contents"
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
