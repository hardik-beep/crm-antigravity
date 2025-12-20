import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({
                status: 'error',
                message: 'Supabase Admin Client not initialized',
            }, { status: 500 });
        }

        const { error, count } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) {
            return NextResponse.json({
                status: 'unhealthy',
                message: error.message
            }, { status: 503 });
        }

        return NextResponse.json({
            status: 'healthy',
            message: 'Supabase connection active',
            userCount: count
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
