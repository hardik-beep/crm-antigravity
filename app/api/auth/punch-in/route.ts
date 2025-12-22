import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const result = await db.punchInUser(userId);

        if (!result) {
            console.log(`[PunchIn] No active session found for ${userId}, creating new session...`);

            const punchInTime = new Date().toISOString();
            const sessionId = `sess_${Date.now()}_${Math.random()}`;

            await db.createSession({
                sessionId,
                userId,
                punchInTime: punchInTime,
                lastActiveTime: punchInTime,
                isActive: true
            });

            return NextResponse.json({
                success: true,
                punchInTime: punchInTime
            });
        }

        return NextResponse.json({
            success: true,
            punchInTime: result.punch_in_time
        });
    } catch (error: any) {
        console.error("Punch-in error:", error);
        return NextResponse.json({
            error: error.message || 'Punch-in failed',
            details: error.toString()
        }, { status: 500 });
    }
}
