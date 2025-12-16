
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const history = db.getUploadHistory();
        return NextResponse.json({ history });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const entry = await req.json();
        db.addUploadHistory(entry);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
    }
}
