import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    // 1. Log Entry
    console.log("[PunchIn API] Request received");

    try {
        // 2. Parse Body safely
        let body;
        try {
            const text = await req.text();
            if (!text) throw new Error("Empty request body");
            body = JSON.parse(text);
        } catch (e: any) {
            console.error("[PunchIn API] Body parse error:", e.message);
            return NextResponse.json({ error: 'Invalid JSON body', details: e.message }, { status: 400 });
        }

        const { userId } = body;

        // 3. Validate Input
        if (!userId) {
            console.error("[PunchIn API] Missing userId");
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        console.log(`[PunchIn API] Processing for user: ${userId}`);

        // 4. Perform DB Operation
        // We wrap this in its own try-catch just in case db.punchInUser throws non-error object
        try {
            const result = await db.punchInUser(userId);

            if (!result) {
                console.log(`[PunchIn API] No active session, creating new session for ${userId}`);
                const punchInTime = new Date().toISOString();
                const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;

                await db.createSession({
                    sessionId,
                    userId,
                    punchInTime: punchInTime,
                    lastActiveTime: punchInTime,
                    isActive: true
                });

                console.log(`[PunchIn API] New session created: ${sessionId}`);
                return NextResponse.json({ success: true, punchInTime });
            }

            console.log(`[PunchIn API] Session updated for ${userId}`);
            return NextResponse.json({ success: true, punchInTime: new Date().toISOString() });

        } catch (dbError: any) {
            console.error("[PunchIn API] Database operation failed:", dbError);
            return NextResponse.json({
                error: 'Database operation failed',
                details: dbError.message || String(dbError)
            }, { status: 500 });
        }

    } catch (globalError: any) {
        console.error("[PunchIn API] Catastrophic error:", globalError);
        return NextResponse.json({
            error: 'Server Internal Error',
            details: globalError.message || String(globalError)
        }, { status: 500 });
    }
}
