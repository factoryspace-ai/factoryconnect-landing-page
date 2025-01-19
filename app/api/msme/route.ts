import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMsmesByUserEmail } from "@/lib/msme-utils";

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
    
    const userMsmes = await getMsmesByUserEmail(userEmail);

    if (!userMsmes || userMsmes.length === 0) {
      return new NextResponse("No MSMEs found for user", { status: 404 });
    }

    return NextResponse.json(userMsmes);
  } catch (error) {
    console.error("[MSME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}