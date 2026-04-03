import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    
    const backendUrl = `http://localhost:3001/api/vnpay-public/vnpay-return?${query}`;
    
    console.log('[PROXY-REQ] Forwarding to Public VNPay:', backendUrl);
    
    try {
        const client = axios.create(); 
        const response = await client.get(backendUrl);
        console.log('[PROXY-RES] Success');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('[PROXY-ERROR]', error.response?.status, error.response?.data || error.message);
        return NextResponse.json(
            error.response?.data || { message: error.message },
            { status: error.response?.status || 500 }
        );
    }
}
