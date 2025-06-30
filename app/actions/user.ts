"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
export const createNewUser = async () => {
  const user = await currentUser();

  //   console.log("Creating new user", user);
  const match = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user?.id as string));

  console.log("tttUser match result:", match);
  if (!match.length) {
    console.log("User not found in database, creating new user");
    await db.insert(users).values({
      clerkId: user?.id as string,
      name: user?.firstName || "Anonymous",
      email: user?.emailAddresses[0]?.emailAddress || "",
    });
  }

  redirect("/journal");
};
