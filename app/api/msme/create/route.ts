import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { user, msme, userMsme } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, subdomain } = await req.json();

    if (!name || !subdomain) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if subdomain already exists
    const existingMsme = await db.query.msme.findFirst({
      where: eq(msme.subdomain, subdomain.toLowerCase()),
    });

    if (existingMsme) {
      return new NextResponse("Subdomain already exists", { status: 400 });
    }

    // Get user's database ID
    const dbUser = await db.query.user.findFirst({
      where: eq(user.clerkId, userId),
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user already has an organization
    const existingUserMsmes = await db.query.userMsme.findMany({
      where: eq(userMsme.userId, dbUser.id),
    });

    if (existingUserMsmes.length > 0) {
      return new NextResponse(
        "You can only create one organization", 
        { status: 400 }
      );
    }

    // Create new MSME
    const [createdMsme] = await db
      .insert(msme)
      .values({
        name,
        subdomain: subdomain.toLowerCase(),
      })
      .returning();

    // Associate user as admin
    await db.insert(userMsme).values({
      userId: dbUser.id,
      msmeId: createdMsme.id,
      accessLevel: "admin",
      isDefault: true,
    });

    return NextResponse.json(createdMsme);
  } catch (error) {
    console.error("Error creating MSME:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
