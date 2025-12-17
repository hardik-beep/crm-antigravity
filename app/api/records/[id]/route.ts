
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        db.deleteRecord(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}
