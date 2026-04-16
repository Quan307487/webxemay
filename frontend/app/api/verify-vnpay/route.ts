import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    const backendUrl = `${BACKEND_URL}/api/vnpay-public/vnpay-return?${query}`;

    try {
        const client = axios.create();
        const response = await client.get(backendUrl);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            error.response?.data || { message: error.message },
            { status: error.response?.status || 500 }
        );
    }
}
