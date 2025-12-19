import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'agent'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    punchInTime?: string | null
}

export interface AttendanceRecord {
    id: string
    userId: string
    type: 'in' | 'out'
    timestamp: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    attendance: AttendanceRecord[]

    // Actions
    login: (user: User) => void
    logout: () => void
    punchIn: () => void
    punchOut: () => void
    setPunchInTime: (time: string) => void
    getLastPunch: (userId: string) => AttendanceRecord | undefined
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            attendance: [],

            login: (user) => {
                set({
                    isAuthenticated: true,
                    user
                })
            },

            logout: () => set({ user: null, isAuthenticated: false }),

            setPunchInTime: (time) => {
                const { user } = get()
                if (user) {
                    set({ user: { ...user, punchInTime: time } })
                }
            },

            punchIn: () => {
                const { user, attendance } = get()
                if (!user) return

                const record: AttendanceRecord = {
                    id: `punch-${Date.now()}`,
                    userId: user.id,
                    type: 'in',
                    timestamp: new Date().toISOString()
                }

                set({ attendance: [...attendance, record] })
            },

            punchOut: () => {
                const { user, attendance } = get()
                if (!user) return

                const record: AttendanceRecord = {
                    id: `punch-${Date.now()}`,
                    userId: user.id,
                    type: 'out',
                    timestamp: new Date().toISOString()
                }

                set({ attendance: [...attendance, record] })
            },

            getLastPunch: (userId) => {
                const records = get().attendance.filter(r => r.userId === userId)
                return records[records.length - 1]
            }
        }),
        {
            name: 'auth-storage',
        }
    )
)
