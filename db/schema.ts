import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  boolean,
  real,
  uuid,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Enum definition
export const journalEntryStatusEnum = pgEnum("JOURNAL_ENTRY_STATUS", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

// User table
export const users = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  clerkId: text("clerkId").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// Account table
export const accounts = pgTable(
  "Account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").notNull(),
  },
  (table) => ({
    userIdUnique: uniqueIndex("Account_userId_key").on(table.userId),
  })
);

// JournalEntry table
export const journalEntries = pgTable(
  "JournalEntry",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    content: text("content").notNull(),
    status: journalEntryStatusEnum("status").notNull().default("DRAFT"),
  },
  (table) => ({
    userIdIdUnique: uniqueIndex("JournalEntry_userId_id_key").on(
      table.userId,
      table.id
    ),
  })
);

// EntryAnalysis table
export const entryAnalyses = pgTable(
  "EntryAnalysis",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    entryId: uuid("entryId").notNull(),
    userId: uuid("userId").notNull(),
    mood: text("mood").notNull(),
    subject: text("subject").notNull(),
    negative: boolean("negative").notNull(),
    summary: text("summary").notNull(),
    color: text("color").notNull().default("#0101fe"),
    sentimentScore: real("sentimentScore").notNull(),
  },
  (table) => ({
    entryIdUnique: uniqueIndex("EntryAnalysis_entryId_key").on(table.entryId),
    userIdIndex: index("EntryAnalysis_userId_idx").on(table.userId),
  })
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  entries: many(journalEntries),
  analysis: many(entryAnalyses),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
  analysis: one(entryAnalyses, {
    fields: [journalEntries.id],
    references: [entryAnalyses.entryId],
  }),
}));

export const entryAnalysesRelations = relations(entryAnalyses, ({ one }) => ({
  entry: one(journalEntries, {
    fields: [entryAnalyses.entryId],
    references: [journalEntries.id],
  }),
  user: one(users, {
    fields: [entryAnalyses.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = InferSelectModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type JournalEntry = InferSelectModel<typeof journalEntries>;
export type EntryAnalysis = InferSelectModel<typeof entryAnalyses>;
