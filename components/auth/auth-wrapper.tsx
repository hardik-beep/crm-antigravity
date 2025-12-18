"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useCRMStore } from "@/lib/store"
import { LoginScreen } from "./login-screen"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeIn } from "@/lib/animations"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const user = useAuthStore(state => state.user)
    const fetchRecords = useCRMStore(state => state.fetchRecords)
    const fetchUploadHistory = useCRMStore(state => state.fetchUploadHistory)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Heartbeat to keep session active
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return

        const sendHeartbeat = () => {
            fetch('/api/auth/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            }).catch(e => console.error("Heartbeat failed", e))
        }

        sendHeartbeat() // Send immediately
        const interval = setInterval(sendHeartbeat, 60000) // Then every 60s

        return () => clearInterval(interval)
    }, [isAuthenticated, user?.id])

    // Fetch data on auth and poll for updates
    useEffect(() => {
        if (isAuthenticated) {
            // Initial fetch
            fetchRecords()
            fetchUploadHistory()

            // Poll every 15 seconds to keep data in sync
            // The polling is now more efficient as it checks for a timestamp change first
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
                <motion.div
                    key="app"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="contents" // Use contents to avoid breaking layout
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
