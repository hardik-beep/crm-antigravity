
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { ids } = await req.json();
        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: 'Invalid IDs format' }, { status: 400 });
        }
        await db.deleteRecords(ids);
        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete records' }, { status: 500 });
    }
}
