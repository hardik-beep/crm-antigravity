import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const username = String(body.username || '').trim();
        const password = String(body.password || '').trim();

        const user = db.findUser(username);

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        db.createSession({
            sessionId: `sess_${Date.now()}_${Math.random()}`,
            userId: user.id,
            punchInTime: new Date().toISOString(),
            lastActiveTime: new Date().toISOString(),
            isActive: true
        });

        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ user: userWithoutPass });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
