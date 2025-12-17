"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/lib/auth-store"
import { FileSpreadsheet, Lock, User, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeIn, slideUp } from "@/lib/animations"

export function LoginScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore(state => state.login)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // Simulate a slight network delay for the "premium" feel if it's too fast
            const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))

            const resPromise = fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            })

            const [res] = await Promise.all([resPromise, minLoadingTime])
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Login failed")
                setIsLoading(false)
                return
            }

            // Login successful
            const user = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.username,
                role: data.user.role
            }

            login(user)
        } catch (err) {
            setError("Something went wrong. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideUp}
                className="w-full max-w-md"
            >
                <Card className="w-full shadow-2xl border-t-4 border-t-primary/80 overflow-hidden">
                    <CardHeader className="space-y-2 text-center pb-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center ring-1 ring-primary/20 shadow-sm">
                                <FileSpreadsheet className="h-8 w-8 text-primary" />
                            </div>
                        </motion.div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Welcome back</CardTitle>
                        <CardDescription className="text-base text-muted-foreground/80">
                            Enter your credentials to access the CRM
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-5 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">User ID</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Enter User ID"
                                        className="pl-10 h-11 transition-all border-muted focus-visible:ring-primary/20 hover:border-primary/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 transition-all border-muted focus-visible:ring-primary/20 hover:border-primary/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="text-sm text-destructive font-medium text-center bg-destructive/10 p-2 rounded-md"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </CardContent>
                        <CardFooter className="pb-8">
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
