import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, not, and, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { msme, userMsme } from "@/db/schema";
import { headers } from "next/headers";

export async function GET() {
  try {
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    
    // Get all MSMEs except current user's MSME
    const availableMsmes = await db
      .select({
        id: msme.id,
        name: msme.name,
        subdomain: msme.subdomain, 
        description: msme.description,
        address: msme.address,
        city: msme.city,
        state: msme.state,
        country: msme.country,
        zipCode: msme.zipCode,
        contact_number: msme.contact_number,
        contact_email: msme.contact_email,
        year_established: msme.year_established,
        working_hours: msme.working_hours,
        logo: msme.logo,
        industry: msme.industry,
        services: msme.services,
        ratings: msme.ratings,
        pricing: msme.pricing,
        gst:msme.gst
      })
      .from(msme)

    return NextResponse.json({ msmes: availableMsmes });
  } catch (error) {
    console.error("Error fetching available MSMEs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// create a new msme from email 
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name } = await request.json();

    const msmeData = await db
      .select({
        id: msme.id,
      })
      .from(msme)
      .where(eq(msme.contact_email, email));

    if (msmeData && msmeData.length > 0) {
      return NextResponse.json({ error: "MSME already exists" }, { status: 400 });
    }


    const newMsme = await db
      .insert(msme)
      .values({
        name: name,
        contact_email: email,
      })
      .returning();
    
    const newMsmeId = newMsme[0].id;

    await db
      .insert(userMsme)
      .values({
        email: email,
        msmeId: newMsmeId,
      });

    return NextResponse.json({ message: "MSME created successfully", msmeId: newMsmeId }, { status: 200 });
  } catch (error) {
    console.error("Error creating MSME:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

