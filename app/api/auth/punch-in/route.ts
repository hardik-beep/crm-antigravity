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
            return NextResponse.json({ error: 'No active session found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            punchInTime: result.punch_in_time
        });
    } catch (error) {
        console.error("Punch-in error:", error);
        return NextResponse.json({ error: 'Punch-in failed' }, { status: 500 });
    }
}
