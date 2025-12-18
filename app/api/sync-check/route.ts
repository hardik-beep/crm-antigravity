
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const lastModified = await db.getLastModified();
        // Use optimized count queries
        const recordCount = await (db as any).getRecordCount(); // Cast to any if inference lags, or just call it if TS is happy.
        const uploadCount = await (db as any).getUploadCount();

        return NextResponse.json({
            lastModified,
            recordCount,
            uploadCount
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
    }
}
