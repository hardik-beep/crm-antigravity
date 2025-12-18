
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CRMRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const records = await db.getRecords();
        return NextResponse.json({ records });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const records = body.records; // Expecting array of records

        if (Array.isArray(records)) {
            // Appending multiple records
            // Appending multiple records
            // Optimized to just search and insert instead of fetch-all-and-save
            await (db as any).addManyRecords(records);
            return NextResponse.json({ success: true, count: records.length });
        } else {
            // Single record
            await db.addRecord(body);
            return NextResponse.json({ success: true });
        }
    } catch (error) {
        console.error("POST /api/records error:", error);
        return NextResponse.json({ error: 'Failed to save records' }, { status: 500 });
    }
}
