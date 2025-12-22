import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            console.error("[PunchIn] Missing userId in request body");
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        console.log(`[PunchIn] Attempting punch-in for user: ${userId}`);
        const result = await db.punchInUser(userId);

        if (!result) {
            console.log(`[PunchIn] No active session found in DB for user ${userId}. Attempting to create one.`);

            const punchInTime = new Date().toISOString();
            const sessionId = `sess_${Date.now()}_${Math.random()}`;

            try {
                await db.createSession({
                    sessionId,
                    userId,
                    punchInTime: punchInTime,
                    lastActiveTime: punchInTime,
                    isActive: true
                });
                console.log(`[PunchIn] Created new active session ${sessionId} for user ${userId}`);
            } catch (sessionError: any) {
                console.error(`[PunchIn] Failed to create fallback session: ${sessionError.message}`);
                // If createSession failed, it's likely a DB connection or constraint issue
                return NextResponse.json({
                    error: 'Database error while creating session',
                    details: sessionError.message
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                punchInTime: punchInTime
            });
        }

        console.log(`[PunchIn] Successfully updated existing session for user ${userId}`);
    } catch (error: any) {
        console.error("[PunchIn] Vital error:", error);

        // Detect specific Supabase auth error
        const isApiKeyError = error.message?.includes("Invalid API key") ||
            JSON.stringify(error).includes("Invalid API key");

        const userMessage = isApiKeyError
            ? "Server Configuration Error: Invalid API Key. Please check SUPABASE_SERVICE_ROLE_KEY in Vercel Settings."
            : (error.message || 'Punch-in failed');

        return NextResponse.json({
            error: userMessage,
            details: typeof error === 'object' ? JSON.stringify(error) : String(error)
        }, { status: 500 });
    }
}
