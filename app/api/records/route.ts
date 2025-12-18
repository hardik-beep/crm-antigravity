
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
        const serverTime = new Date().toISOString();

        if (Array.isArray(records)) {
            console.log(`[Records API] Received request to save ${records.length} records.`);

            // Appending multiple records
            // addManyRecords now returns the ISO timestamp of insertion
            const dbTimestamp = await (db as any).addManyRecords(records);

            // Use the actual DB timestamp if available, ensuring client sync is precise
            // Explicitly cast or check if it's a string, though our db.ts update guarantees it returns string or throws
            const actualServerTime = typeof dbTimestamp === 'string' ? dbTimestamp : serverTime;

            console.log(`[Records API] Successfully saved ${records.length} records at ${actualServerTime}.`);
            return NextResponse.json({ success: true, count: records.length, serverTime: actualServerTime });
        } else {
            // Single record
            await db.addRecord(body);
            return NextResponse.json({ success: true, serverTime });
        }
    } catch (error) {
        console.error("POST /api/records error:", error);
        return NextResponse.json({ error: 'Failed to save records' }, { status: 500 });
    }
}
