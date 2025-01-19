import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { msme, userMsme, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const clerkUser = await response.json();
    const userEmail = clerkUser.email_addresses[0].email_address.toLowerCase();
    
    console.log("Searching for MSME with email:", userEmail);

    // Get all MSMEs associated with the user through the junction table
    const userMsmes = await db
      .select({
        msme: msme,
        accessLevel: userMsme.accessLevel,
        department: userMsme.department,
        email: userMsme.email
      })
      .from(userMsme)
      .innerJoin(msme, eq(userMsme.msmeId, msme.id))
      .where(eq(userMsme.email, userEmail));

    console.log("Found MSMEs:", userMsmes);

    if (!userMsmes || userMsmes.length === 0) {
      return new NextResponse("No MSMEs found for user", { status: 404 });
    }

    return NextResponse.json(userMsmes);
  } catch (error) {
    console.error("[MSME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
