import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { getToken } = getAuth(req)

    if (!getToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = await getToken()

    return NextResponse.json({ token })
}