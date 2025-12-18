import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const agents = await db.getActiveAgents();
        return NextResponse.json({ agents });
    } catch (error) {
        console.error("Error fetching agents:", error);
        return NextResponse.json({
            error: 'Failed to fetch agents',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username: rawUsername, password, name, role } = body;
        const username = String(rawUsername || '').trim().toLowerCase();

        if (!username || !password || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existing = await db.findUser(username);
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const newUser = {
            id: `user-${Date.now()}`,
            username,
            password,
            name,
            role: role || 'agent',
            createdAt: new Date().toISOString()
        };

        await db.addUser(newUser);

        return NextResponse.json({ user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            error: 'Failed to create user',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
