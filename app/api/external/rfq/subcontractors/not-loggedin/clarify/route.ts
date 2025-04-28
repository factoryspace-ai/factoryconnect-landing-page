import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const header = request.headers;
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const rfq_id = searchParams.get('rfq_id');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/subcontractor/${rfq_id}/clarifications/`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
}

export async function GET(request: NextRequest) {
    const header = request.headers;
    const searchParams = request.nextUrl.searchParams;
    const rfq_id = searchParams.get('rfq_id');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/subcontractor/${rfq_id}/clarifications/`, {
        method: 'GET',
        headers: header,
    });
    const data = await response.json();
    return NextResponse.json(data);
}
