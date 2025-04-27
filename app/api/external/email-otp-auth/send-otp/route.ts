import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // const header = request.headers;
    const body = await request.json();
    try {
    // Use specific headers that match the curl request and add trailing slash to URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/auth/request_otp/`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    
    // Check if the response is ok before parsing JSON
    if (!response.ok) {
        console.error(`Backend API returned status: ${response.status}`);
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        return NextResponse.json(
            { error: `Backend API error: ${response.status}`, details: errorText },
            { status: response.status }
        );
    }
    
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
    } catch (error) {
        console.error('Error in send-otp route:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
