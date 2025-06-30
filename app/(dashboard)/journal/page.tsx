import { db } from "@/db";
import { entryAnalyses } from "@/db/schema";
import { getUserByCleckId } from "@/utils/auth";
import { eq } from "drizzle-orm";
const getEntries = async () => {
  const user = await getUserByCleckId();
  const entriess = await db
    .select()
    .from(entryAnalyses)
    .where(eq(entryAnalyses.userId, user[0].id));

  return entriess;
};

export default async function JournalPage() {
  const entries = await getEntries();
  console.log("Entries:", entries);
  return <div>JournalPage</div>;
}
