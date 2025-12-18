import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const username = String(body.username || '').trim();
        const password = String(body.password || '').trim();

        // 1. Try to find user in DB
        let user: any = await db.findUser(username);
        let passwordMatch = user && user.password === password;

        // 2. Fallback: Check hardcoded defaults if DB fails or user not found
        // This ensures admin/agent always works even if file system is read-only or empty
        if (!user) {
            if (username === 'admin' && password === 'admin123') {
                user = {
                    id: 'admin-1',
                    username: 'admin',
                    password: 'admin123',
                    name: 'Administrator',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                };
                passwordMatch = true;
            } else if (username === 'agent' && password === 'agent') {
                user = {
                    id: 'agent-default',
                    username: 'agent',
                    password: 'agent',
                    name: 'Default Agent',
                    role: 'agent',
                    createdAt: new Date().toISOString()
                };
                passwordMatch = true;
            }
        }

        if (!user || !passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        try {
            await db.createSession({
                sessionId: `sess_${Date.now()}_${Math.random()}`,
                userId: user.id || user._id?.toString(),
                punchInTime: new Date().toISOString(),
                lastActiveTime: new Date().toISOString(),
                isActive: true
            });
        } catch (e) {
            // Ignore session creation error on read-only systems
            console.error("Session creation failed (likely read-only FS):", e);
        }

        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ user: userWithoutPass });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
