import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Session from '@/lib/models/Session'; // Direct access for specific update

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // We need to update the active session for this user
        // We use Session model directly or add a method to db.ts. 
        // Since we already import Session in db.ts and it's not exported, we can add a method to db.ts or use direct mongoose if we connect.
        // db.ts handles connection, so let's use a new method in db.ts or just rely on mongoose if we are sure it's connected.
        // But better practice to stick to db.ts abstraction if possible, but I don't want to edit db.ts again if I can avoid it.
        // Actually, db.ts exports 'db' object. I can add 'punchInUser' there? 
        // No, I already edited db.ts. Let's add punchInUser to db.ts? 
        // Or just use the model here. 'db' helper ensures connection.

        // Let's use db helper to connect then use model.
        await db.getUsers(); // Ensures connection

        const result = await Session.findOneAndUpdate(
            { userId, isActive: true },
            { punchInTime: new Date() },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: 'No active session found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, punchInTime: result.punchInTime });
    } catch (error) {
        console.error("Punch-in error:", error);
        return NextResponse.json({ error: 'Punch-in failed' }, { status: 500 });
    }
}
