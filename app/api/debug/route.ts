
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const user = db.findUser('admin');
        const count = db.getUsers().length;
        const records = db.getRecords().length;
        return NextResponse.json({
            status: 'ok',
            userFound: !!user,
            username: user?.username,
            passMatch: user?.password === 'admin123',
            totalUsers: count,
            totalRecords: records
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
