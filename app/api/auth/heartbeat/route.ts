import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        db.updateHeartbeat(userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Heartbeat failed' }, { status: 500 });
    }
}
