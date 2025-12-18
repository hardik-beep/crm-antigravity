
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const lastModified = await db.getLastModified();
        const records = await db.getRecords();
        const uploadHistory = await db.getUploadHistory();
        return NextResponse.json({
            lastModified,
            recordCount: records.length,
            uploadCount: uploadHistory.length
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
    }
}
