import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMsmesByUserEmail } from "@/lib/msme-utils";

export async function GET() {
  try {
    const { userId } =await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userEmail = user.emailAddresses[0].emailAddress.toLowerCase();
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

export const dynamic = "force-dynamic";