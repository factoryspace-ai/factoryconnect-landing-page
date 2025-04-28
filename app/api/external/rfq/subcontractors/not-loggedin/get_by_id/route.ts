import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const header = request.headers;
    const searchParams = request.nextUrl.searchParams;
    const rfq_id = searchParams.get('rfq_id');
    // console.log(header)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/subcontractor/${rfq_id}/`, {
        method: 'GET',
        headers: header,
    });
    const data = await response.json();
    console.log("data", data)
    return NextResponse.json(data);
}
