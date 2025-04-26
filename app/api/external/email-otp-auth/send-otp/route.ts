import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const header = request.headers;
    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/auth/request_otp`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
}
