import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
export const getUserByCleckId = async () => {
  const { userId } = await auth();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId as string));

  return user;
};
