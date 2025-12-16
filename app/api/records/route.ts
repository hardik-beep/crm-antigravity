
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CRMRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const records = db.getRecords();
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
            const currentRecords = db.getRecords();
            db.saveRecords([...currentRecords, ...records]);
            return NextResponse.json({ success: true, count: records.length });
        } else {
            // Single record
            db.addRecord(body);
            return NextResponse.json({ success: true });
        }
    } catch (error) {
        console.error("POST /api/records error:", error);
        return NextResponse.json({ error: 'Failed to save records' }, { status: 500 });
    }
}
