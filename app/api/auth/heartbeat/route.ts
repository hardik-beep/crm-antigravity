import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const isValid = await db.updateHeartbeat(userId);

        if (isValid === false) {
            return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Heartbeat failed' }, { status: 500 });
    }
}
