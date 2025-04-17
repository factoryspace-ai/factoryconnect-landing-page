import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const quotation_id = searchParams.get("quotation_id");
    const header = request.headers;
    const quotation = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfq/quotation/${quotation_id}/`, {
        method: "GET",
        headers: header
    });
    if (!quotation.ok) {
        return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 });
    }
    const quotationData = await quotation.json();
    return NextResponse.json({ quotationData });
}
