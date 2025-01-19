import { db } from "@/lib/db";
import { msme, userMsme } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getMsmesByUserEmail(userEmail: string) {
  try {
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

    return userMsmes;
  } catch (error) {
    console.error("[GET_MSMES_BY_EMAIL]", error);
    throw error;
  }
}
