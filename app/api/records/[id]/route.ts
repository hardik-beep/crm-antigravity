
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
    params: {
        id: string; // The dynamic segment [id] matches the folder name
    };
}

// In Next.js App Router, dynamic routes receive context as the second argument,
// and searching params requires awaiting them in recent versions, but standard type is usually params.
// However, the standard signature is (request: Request, { params }: { params: { id: string } })

export async function PUT(req: Request, { params }: RouteParams) {
    try {
        const id = params.id;
        const updates = await req.json();
        const records = db.getRecords();
        const record = records.find(r => r.id === id);

        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        const updatedRecord = { ...record, ...updates };
        db.updateRecord(updatedRecord);

        return NextResponse.json({ success: true, record: updatedRecord });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const id = params.id;
        db.deleteRecord(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}
