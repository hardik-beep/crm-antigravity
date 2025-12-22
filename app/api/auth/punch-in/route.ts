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
        return NextResponse.json({
            success: true,
            punchInTime: result.punch_in_time
        });
    } catch (error: any) {
        console.error("[PunchIn] Vital error:", error);
        return NextResponse.json({
            error: error.message || 'Punch-in failed',
            details: error.toString()
        }, { status: 500 });
    }
}
