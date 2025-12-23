
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    const soupUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const checks = {
        url_exists: !!soupUrl,
        url_valid: soupUrl?.startsWith('http'),
        key_exists: !!serviceKey,
        key_length: serviceKey?.length || 0,
        client_initialized: !!supabaseAdmin
    };

    let dbCheck = "Pending";
    let dbError = null;

    if (supabaseAdmin) {
        try {
            const { data, error } = await supabaseAdmin.from('users').select('count').limit(1);
            if (error) throw error;
            dbCheck = "Success - Connected to Supabase";
        } catch (e: any) {
            dbCheck = "Failed";
            dbError = e.message || String(e);
        }
    } else {
        dbCheck = "Skipped - Client is null";
    }

    return NextResponse.json({
        status: "Debug Report",
        environment: checks,
        database_connection: dbCheck,
        last_error: dbError,
        timestamp: new Date().toISOString()
    }, { status: 200 });
}
