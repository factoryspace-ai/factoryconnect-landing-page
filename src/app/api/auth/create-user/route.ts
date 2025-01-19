import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } =await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user data from Clerk
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const clerkUser = await response.json();

    if(!clerkUser){
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user already exists in our database
    const existingUser = await db.query.user.findFirst({
      where: eq(user.clerkId, userId),
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }

    // Create new user in our database
    const newUser = await db.insert(user).values({
      clerkId: userId,
      email: clerkUser.email_addresses[0].email_address,
      name: `${clerkUser.first_name} ${clerkUser.last_name}`,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      profilePicture: clerkUser.image_url,
      username: clerkUser.username,
      emailVerified: clerkUser.email_addresses[0].verification?.status === "verified",
    }).returning();

    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
