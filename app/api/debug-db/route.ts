import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Trigger seeding if needed
        await db.getUsers().catch(() => { });

        if (!supabaseAdmin) {
            return NextResponse.json({
                error: 'Supabase Admin Client not initialized',
                envStatus: {
                    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? `PRESENT (${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15)}...)` : 'MISSING',
                    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? `PRESENT (${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...)` : 'MISSING'
                }
            }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin.from('users').select('*').limit(1);

        if (error) {
            return NextResponse.json({
                error: 'Supabase Query Failed',
                fullError: error,
                envStatus: {
                    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? `PRESENT (${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15)}...)` : 'MISSING',
                    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? `PRESENT (${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...)` : 'MISSING'
                }
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Supabase Connection OK',
            userCount: data
        });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Unexpected Error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
