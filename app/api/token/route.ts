import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { getToken } = getAuth(req)

    if (!getToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = await getToken()

    return NextResponse.json({ token })
}