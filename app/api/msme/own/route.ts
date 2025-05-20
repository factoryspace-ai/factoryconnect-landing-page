import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { msme } from "@/db/schema";


export async function GET(request: NextRequest) {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const msmeData = await db
        .select()
        .from(msme)
        .where(eq(msme.contact_email, email));

    if (msmeData.length === 0) {
        return NextResponse.json({ error: "MSME not found" }, { status: 404 });
    }

    return NextResponse.json(msmeData[0], { status: 200 });
}   