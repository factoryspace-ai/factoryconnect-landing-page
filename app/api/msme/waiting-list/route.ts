import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { msmeWaitingList, msme, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // const { userId } = await auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }
    // console.log(req);

    const { companyName, email, companyDetails } = await req.json();

    // Check if subdomain exists
    // const existingMsme = await db.query.msme.findFirst({
    //   where: eq(msme.subdomain, subdomain),
    // });

    // if (existingMsme) {
    //   console.log("Subdomain already exists");
    //   return new NextResponse("Subdomain already exists", { status: 400 });
    // }

    // const dbuser = await db.query.user.findFirst({
    //   where: eq(user.clerkId, userId),
    // });
    // if (!dbuser) {
    //   return new NextResponse("User not found", { status: 404 });
    // }

    // Create MSME entry first
    // const [newMsme] = await db.insert(msme).values({
    //   name: companyName,
    //   subdomain,
    // }).returning();

    // Create waiting list entry
    await db.insert(msmeWaitingList).values({
      // userId: dbuser.id,
      // subdomain,
      companyName,
      email,
      companyDetails,
    });

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("Error in waiting list creation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return new NextResponse("Subdomain is required", { status: 400 });
    }

    // Check if subdomain exists
    // const existingMsme = await db.query.msme.findFirst({
    //   where: eq(msme.subdomain, subdomain),
    // });

    // if (existingMsme) {
    //   return new NextResponse(
    //     JSON.stringify({ message: "Subdomain already exists" }), 
    //     { status: 400, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // // Check waiting list as well
    // const existingWaitingList = await db.query.msmeWaitingList.findFirst({
    //   where: eq(msmeWaitingList.subdomain, subdomain),
    // });

    // if (existingWaitingList) {
    //   return new NextResponse(
    //     JSON.stringify({ message: "Subdomain already exists" }), 
    //     { status: 400, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    return new NextResponse(
      JSON.stringify({ message: "Subdomain is available" }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
