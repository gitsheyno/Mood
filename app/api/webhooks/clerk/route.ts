// app/api/webhooks/clerk/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);
    const { type } = event;

    console.log("Received Clerk webhook event:", type, event);
    if (type === "user.created" || type === "user.updated") {
      const data = event.data;

      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name} ${last_name || ""}`.trim();

      if (!id || !email) throw new Error("Missing user info from Clerk");

      if (type === "user.created") {
        await db
          .insert(users)
          .values({ clerkId: id, email, name })
          .onConflictDoUpdate({
            target: users.clerkId,
            set: { email, name },
          });
      } else {
        await db
          .update(users)
          .set({ email, name })
          .where(eq(users.clerkId, id));
      }
    }

    if (type === "user.deleted") {
      const { id } = event.data as { id: string };
      await db.delete(users).where(eq(users.clerkId, id));
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new Response("Webhook error", { status: 400 });
  }
}
