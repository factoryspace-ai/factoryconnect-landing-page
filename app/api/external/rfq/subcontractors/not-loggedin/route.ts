import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const header = request.headers;
    console.log(header)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/subcontractor/`, {
        method: 'GET',
        headers: header,
    });
    const data = await response.json();
    return NextResponse.json(data);
}
