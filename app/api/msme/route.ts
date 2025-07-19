import { NextRequest, NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server";
import { getMsmesByUserEmail } from "@/lib/msme-utils";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const responseClerk = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    const { getToken } = getAuth(req)
    const token = await getToken()


    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await responseClerk.json();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userEmail = user.email_addresses[0].email_address;
    // const userMsmes = await getMsmesByUserEmail(userEmail);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mig/api/msme/api/msme/getMyMsme?email=${userEmail}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    let userMsmes = [];
    for (let i = 0; i < result.length; i++) {
      userMsmes.push({ msme: result[i] });
    }


    if (!userMsmes || userMsmes.length == 0) {
      return new NextResponse(result.message, { status: 404 });
    }

    return NextResponse.json(userMsmes, { status: 200 });
  } catch (error) {
    console.error("[MSME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}