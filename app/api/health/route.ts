import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
    try {
        const conn = await dbConnect();

        if (!conn) {
            return NextResponse.json({
                status: 'error',
                message: 'MongoDB URI is not defined or connection failed.',
                readyState: 0
            }, { status: 500 });
        }

        const readyState = mongoose.connection.readyState;
        const potentialStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        return NextResponse.json({
            status: readyState === 1 ? 'healthy' : 'unhealthy',
            message: `Database is ${potentialStates[readyState]}`,
            readyState
        }, { status: readyState === 1 ? 200 : 503 });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            readyState: mongoose.connection.readyState
        }, { status: 500 });
    }
}
